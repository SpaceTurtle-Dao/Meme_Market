-- Name: Ore Seller

local json = require("json")
local ao = require("ao")

Constants = Constants or {}

Constants.Name = "Ore Seller"

Constants.GameplayProcess = "ElHCsTvRsN7_5Bpy1d3dC4kaVtAXMWiCMVz46H6sP3k"

Constants.TARGET_WORLD_PID = "_9QcH-Ma0LRvYInsa36d8zEkMRB9tfoAyEaLHmlUw3U"

Constants.ARToken = "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10"

Constants.BazarUCM = "U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0"

Constants.OrePrice = 100000000000

Constants.OrderMessage = "Create-Order"

Constants.SwapToken = "eLAgDHhcthcmjeaywlqkKTo8oPLZOc3YTQdU5ENJjKY"

-- Schema
function BuyOreSchemaTags()
  return [[
{
  "type": "object",
  "required": [
    "Action",
    "Target",
    "Recipient",
    "Quantity",
    "X-Order-Action",
    "X-Swap-Token"
  ],
  "properties": {
    "Action": {
      "type": "string",
      "const": "Transfer"
    },
    "Target": {
        "type": "string",
        "const": "]] .. Constants.ARToken .. [["
    },
    "Recipient": {
      "type": "string",
      "const": "]] .. Constants.BazarUCM .. [["
    },
    "Quantity": {
      "type": "number",
      "const": ]] .. (Constants.OrePrice) .. [[,
    },
    "X-Order-Action": {
      "type": "string",
      "const": "]] .. Constants.OrderMessage .. [["
    },
    "X-Swap-Token": {
      "type": "string",
      "const": "]] .. Constants.SwapToken .. [["
    }
  }
}
]]
end

function SchemaExternalHasProfile(profileId)
  return {
    BuyOre = {
      Target = profileId,       -- Can be nil? In that case it must be supplied externally
      Title = "Purchase Strange Ore",
      Description =
      "By clicking submit you are calling your Profile process to purchase Strange Ore for 0.1 AR on Bazar.",
      Schema = {
        Tags = json.decode(BuyOreSchemaTags()),
        -- Data
        -- Result?
      },
    },
  }
end

Handlers.add(
  'Profile-Response',
  Handlers.utils.hasMatchingTag("Action", "Profile-Response"),
  function(msg)
    print("profile response")
    local profileId = msg.Tags.Profile
    local userId = msg.Tags.UserId
    print("profile: " .. profileId .. "user: " .. userId)

    ao.send({
      Target = userId,
      Tags = { Type = 'SchemaExternal' },
      Data = json.encode(SchemaExternalHasProfile(profileId))
    })
  end
)

Handlers.add(
  'SchemaExternal',
  Handlers.utils.hasMatchingTag('Action', 'SchemaExternal'),
  function(msg)
    print('SchemaExternal')
    ao.send({
      Target = Constants.GameplayProcess,
      Tags = {
        Action = 'Profile',
        UserId = msg.From,
      },
    })
  end
)

