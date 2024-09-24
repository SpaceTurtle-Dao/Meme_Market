<script context="module" lang="ts">
	export const Event = () => {
		let _tags = [{ name: "Action", value: "Event" }];
		return _tags;
	};

	export const Subscribe = (
		token: string,
		quantity: string,
		relay: string,
	) => {
		let _tags = [
			{ name: "Action", value: "Subscribe" },
			{ name: "Token", value: token },
			{ name: "Quantity", value: quantity },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const UnSubscribe = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "UnSubscribe" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const SetOwner = (owner: string) => {
		let _tags = [
			{ name: "Action", value: "SetOwner" },
			{ name: "_Owner", value: owner },
		];
		return _tags;
	};

	export const GetOwner = () => {
		let _tags = [
			{ name: "Action", value: "GetOwner" },
		];
		return _tags;
	};

	export const Info = () => {
		let _tags = [{ name: "Action", value: "Info" }];
		return _tags;
	};

	export const Subs = () => {
		let _tags = [{ name: "Action", value: "Subs" }];
		return _tags;
	};

	export const Subscriptions = () => {
		let _tags = [{ name: "Action", value: "Subscriptions" }];
		return _tags;
	};

	export const IsSubscribed = (relay: string) => {
		let _tags = [
			{ name: "Action", value: "IsSubscribed" },
			{ name: "Relay", value: relay },
		];
		return _tags;
	};

	export const FetchFeed = (filters: string) => {
		return [
			{ name: "Action", value: "FetchFeed" },
			{ name: "Filters", value: filters },
		];
	};

	export const FetchEvents = (filters: string) => {
		return [
			{ name: "Action", value: "FetchEvents" },
			{ name: "Filters", value: filters },
		];
	};

	//INDEXER METHODS
	export const Request = () => {
		let _tags = [{ name: "Action", value: "Request" }];
		return _tags;
	};

	export const Relay = (owner: string) => {
		let _tags = [
			{ name: "Action", value: "Relay" },
			{ name: "_Owner", value: owner },
		];
		return _tags;
	};

	export const Relays = (page: string, size: string) => {
		let _tags = [
			{ name: "Action", value: "Relays" },
			{ name: "Page", value: page },
			{ name: "Size", value: size },
		];
		return _tags;
	};
</script>
