# Wave Reader React Prompt

## Overview

This document describes how to construct Wave Reader as a one-prompt Cursor-AI plan - we use React, and keep it simple with graphQL adapters to background.js, content.js, and backend services. We don't use Tomes, and don't include premium features, but we do use XState for state management.

Please select here, whether or not to use XState with graphQL adapters as state machine management, use the existing RobotCopy system, or a classic POJO state machine management system with actions and reducers:

- XState with local server facade and graphQL adapters as state machine management
- Use the existing RobotCopy system
- A classic POJO state machine management system with actions and reducers
- A classic POJO class structure with evented or observeable Remote Procedure Calls (classic RPC)

## Implementation

### Architecture Overview

- background
    - sync service (loads settings, and consolidates backend requests)
        - interchange service (intermediate router machine for chromium api messaging RPC (remote procedure call))
- popup
    - sync service
    - go button
    - tabs
        - about
        - how to
        - settings
- content
    - sync service
    - ui css selector service
    - animation css injection service

## Backend Considerations

### express server

Consider Next.js for RPC approaches as the file structure is good... for that, as it can mirror a classy file structure nicely and remove the labor of call management. You may still want annotations (for the endpoint connections, or autowiring with apple sauce etc (i'm just a little hungry, there's no library called apple sauce, but that might be a good name if you're going to make one for wiring annotations in typescript, like a fork of retrofit2 for typescript!)).

### settings service

Consider using google sync options rather than a backend, as free tier AWS is 1 gb per year, so at the beginning, we might get bitten a little.

### messaging service

Regardless of RPC strategy, you may want to consider hashing and salting messages sent through the chrome api in addition to the already presented encryption strategy. Please see the fish burger example and wave reader code proper for reading material.

### settings dao
~
### settings ML service

Line fitting and clustering algorithms help here, though an LSTM for settings might do quite nicely.

####    settings tensorflow lite ML expressions for finding the best fit for settings defaults, per website

// research with cursor

## Frontend Considerations

manifest hash webpack extension
content and backend permissions

## Class Structure

// as above
- background
    - sync service (loads settings, and consolidates backend requests)
        - interchange service (intermediate router machine for chromium api messaging RPC (remote procedure call))
- popup
    - sync service
    - go button
    - tabs
        - about
        - how to
        - settings
- content
    - sync service
    - ui css selector service
    - animation css injection service

### Sync Service

Manages the backend api requests for settings, as well as local storage.
Sync capabilities should result from sync requests automated by a sync statemachine.
Sync state machines located in background.js should keep canonical notions of sync state as a MRU cache, but with easy going falloff.

Sync commit should just be in safe operation states:
 
 - settings on save settings send to background.js sync machine
 - ui selector on save select send to background.js sync machine
 - toggle keyboard shortcut activate send to background.js sync machine
 - 

Load order:
 - local storage
 - backend api settings
 - if no local storage: persist backend api to local storage

Data:
 - settings
 - lastSync: number // +new Date()
 - apiSettings
 - fromPopupMessages: Message[]
 - fromContentMessages: Message[]
 - 

### Sync Service adapters

Operating in popup and client scripts, these adapters implement FIFO messaging, using the `acceptedMessages` list to provide endpoint definitions.

If using graphql, you may be able to swap these out for Apollo connectors.

Data:
 - syncLocation: string // ["content", "popup"]
 - acceptedMessages: string[] // messages handled by this client happily
 - messagesToSend: Message[] // queue
 - messagesReceived: Message[] // queue

### Settings Service

 - CSS
 - timing or mouse
 - wave speed
 - wave angle
 - 

### UI Selector service

## Components
---
### Go Button

respect state of going from background, reported by active tab

### Fold Button

respect state of popup

### Settings UI

respect state of popup, then background settings received as update
state of popup is loaded in from sync then background where appropriate if api is enabled

### About

respects state of popup, then background api donation services
shows puppies and kittens
has links to reading services and 

### How to Use

### UI Selector Service