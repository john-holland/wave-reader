# Wave Reader React Prompt

## Overview

This document describes how to construct Wave Reader as a one-prompt Cursor-AI plan - we use React, and keep it simple with graphQL adapters to background.js, content.js, and backend services. We don't use Tomes, and don't include premium features, but we do use XState for state management.

Please select here, whether or not to use XState with graphQL adapters as state machine management, use the existing RobotCopy system, or a classic POJO state machine management system with actions and reducers:

- XState with local server facade and graphQL adapters as state machine management
- Use the existing RobotCopy system
- A classic POJO state machine management system with actions and reducers

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

### settings service

### settings dao

### settings ML service

####    settings tensorflow lite ML expressions for finding the best fit for settings defaults, per website


## Frontend Considerations

manifest hash webpack extension
content and backend permissions

## Class Structure

### Sync Service

### Sync Service adapters

### Settings Service

### UI Selector service

## Components
---
### Go Button

### Fold Button

### Settings UI

### About

### How to Use

### UI Selector Service