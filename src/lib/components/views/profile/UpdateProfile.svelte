<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { z } from 'zod';
    import type { Event } from '$lib/models/Event';
    import type { Profile, UserInfo } from '$lib/models/Profile';
    import { currentUser, userRelay } from '$lib/stores/profile.store';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  
    // Zod schema for profile validation
    const profileSchema = z.object({
      name: z.string().min(1, "Name is required"),
      display_name: z.string().min(1, "Display Name is required"),
      about: z.string().optional(),
      picture: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
      banner: z.string().optional(),
      bot: z.boolean().optional(),
    });
  
    type ProfileSchemaType = z.infer<typeof profileSchema>;
  
    let profile: ProfileSchemaType = {
      name: '',
      display_name: '',
      about: '',
      picture: '',
      website: '',
      banner: '',
      bot: false,
    };
  
    let userInfo: UserInfo;
    let errors: Partial<Record<keyof ProfileSchemaType, string>> = {};
  
    currentUser.subscribe(value => {
      if(value){
        userInfo = value;
      }
    });
  
    let pictureFile: File | null = null;
    let bannerFile: File | null = null;
  
    const dispatch = createEventDispatcher();
  
    function handleFileChange(event: Event, type: 'picture' | 'banner') {
      //@ts-ignore
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        if (type === 'picture') {
          pictureFile = file;
        } else {
          bannerFile = file;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          profile[type] = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  
    async function createProfile() {
      try {
        // Validate the profile data
        profileSchema.parse(profile);
        errors = {};
  
        // Handle file uploads here (e.g., to a server or IPFS)
        if (pictureFile) {
          // Simulating file upload and getting a URL
          profile.picture = URL.createObjectURL(pictureFile);
        }
        if (bannerFile) {
          // Simulating file upload and getting a URL
          profile.banner = URL.createObjectURL(bannerFile);
        }
  
        // Prepare the content for the event
        const content = JSON.stringify({
          name: profile.name,
          display_name: profile.display_name,
          about: profile.about,
          picture: profile.picture,
          website: profile.website,
          banner: profile.banner,
          bot: profile.bot,
        });
  
        const event: Omit<Event, 'id'> = {
          pubkey: userInfo.Token,
          created_at: Math.floor(Date.now() / 1000),
          kind: 0, // Kind 0 is for metadata events in Nostr
          tags: [], // Metadata events typically don't have tags
          content: content
        };
  
        const serialized = JSON.stringify([
          0,
          event.pubkey,
          event.created_at,
          event.kind,
          event.tags,
          event.content
        ]);
  
        const eventId = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(serialized));
        const idHex = Array.from(new Uint8Array(eventId))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
  
        const fullEvent: Event = {
          ...event,
          id: idHex
        };
  
        console.log('Profile creation event:', fullEvent);
  
        //Backend thing to be implemented 😅
        try {
          // Simulating backend call using fetch API
          const response = await fetch('/api/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fullEvent),
          });
  
          if (!response.ok) {
            throw new Error('Failed to create profile');
          }
  
          const result = await response.json();
          console.log('Profile created successfully:', result);
  
          dispatch('profileCreated', profile);
        } catch (error) {
          console.error('Error creating profile:', error);
          // Handle error (e.g., show error message to user)
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors = err.flatten().fieldErrors as Partial<Record<keyof ProfileSchemaType, string>>;
        } else {
          console.error('Unexpected error:', err);
        }
      }
    }
  </script>
  
  <div class="container mx-auto max-w-2xl p-4">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form on:submit|preventDefault={createProfile} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="picture">Profile Picture</Label>
              <div class="flex items-center space-x-4">
                <Avatar class="w-16 h-16">
                  <AvatarImage src={profile.picture} alt={profile.name} />
                  <AvatarFallback>{profile.name ? profile.name[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <Input id="picture" type="file" accept="image/*" on:change={(e) => 
                //@ts-ignore
                handleFileChange(e, 'picture')} />
              </div>
            </div>
  
            <div class="space-y-2">
              <Label for="banner">Banner Image</Label>
              <Input id="banner" type="file" accept="image/*" on:change={(e) => 
              //@ts-ignore
              handleFileChange(e, 'banner')} />
              {#if profile.banner}
                <img src={profile.banner} alt="Banner" class="w-full h-32 object-cover rounded" />
              {/if}
            </div>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name *</Label>
              <Input id="name" bind:value={profile.name} />
              {#if errors.name}
                <p class="text-red-500 text-sm">{errors.name}</p>
              {/if}
            </div>
  
            <div class="space-y-2">
              <Label for="display_name">Display Name *</Label>
              <Input id="display_name" bind:value={profile.display_name} />
              {#if errors.display_name}
                <p class="text-red-500 text-sm">{errors.display_name}</p>
              {/if}
            </div>
          </div>
  
          <div class="space-y-2">
            <Label for="about">About</Label>
            <Textarea id="about" bind:value={profile.about} rows={3} />
          </div>
  
          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input id="website" type="url" bind:value={profile.website} />
            {#if errors.website}
              <p class="text-red-500 text-sm">{errors.website}</p>
            {/if}
          </div>
  
          <Button type="submit" class="w-full">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  </div>