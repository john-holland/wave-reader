# Welcome to the wave-reader wiki & specification!

## 1. Introduction

### 1.1 Purpose

A reading extension to help browser users conquer reading, attention, and tracking issues.

### 1.2 Intended Audience

Browser users who are struggling with reading, attention, and tracking issues.

### 1.3 Intended Use

The extension is designed to be used in the browser, and is not intended to be used in other applications, but may work in Chromium applications.

### 1.4 Product Scope

The extension is designed to be used in the browser, and is designed to help users cope with reading, attention, and tracking issues, and to be able to complete reading tasks.

### 1.5 Definitions and Acronyms

- Wave: A visual effect that helps users track their reading progress and focus on the text.
- Wave Reader: The extension that provides the wave effect.
- Wave Reader Extension: The extension that provides the wave effect.
- Message: A message that is sent between the extension and the browser.
- content.js: The script that is injected into the browser.
- shadow-content.js: The script that is injected into the browser, and is used to manipulate the Shadow DOM.
- popup.js: The script that is injected into the browser, and is used to display the popup.
- background.js: The script that is injected into the browser, and is used to handle the background tasks.
- manifest.json: The manifest file that is used to define the extension.
- README.md: The README file that is used to describe the extension.
- LICENSE: The license file that is used to describe the extension.
- package.json: The package file that is used to describe the extension.
- ReactMachine: a state machine library for React.
- VentureStates: the states allowable for a given state to transition to.
- StateNameMap: a map of state names to state objects.
- Mouse: a virtual mouse that is used to track the user's mouse movement.
- CSS: a style sheet that is used to style the extension, used for animation and font family adjustment.
- aria standards: accessibility standards for the web.


## 2. Overall Description

### 2.1 User Needs

Users need the ability to smoothly and subletly manipulate the screen in 3D to help them track and focus on text. Additionally, they need to quickly toggle this effect for usefulness. Those with ADD and dyslexia can experience fugue states more easily, and in addition to toggling the wave, need some sort of audio feedback to help them stay on track. The audio feedback should adjust scores and melody to help effect perception of time. 

### 2.2 Assumptions and Dependencies

Eyes track semi automatically with the wave, like you're holding a book or phone. Music with complicated rhythm and harmonies can help slow perception of time, and help users stay on track with complicated tasks, whereas music with simple repitition can smooth perception of time, and help users get passed meanial tasks by inducing a fugue state.

## 3. System Features and Requirements

### 3.1 Functional Requirements

#### 3.1.1    Numbered and Described

#### 3.1.2    EARS format: "When [event], the system shall [response]")

#### 3.1.3    Include Specification by Example or BDD format

See https://github.com/john-holland/wave-reader/tree/main/test

### 3.2 Non-Functional Requirements

#### 3.2.1    Performance (e.g., "95% of requests shall return in under 2 seconds")

Popup opens immediately, and the keyboard shortcuts and wave activation happens within 20 milliseconds (preferably below 8ms). Animation is smooth and no more than 1 second added to loading time of any page (currently under 375kb cached).

#### 3.2.2    Security (e.g., "Only authenticated users can access admin API")

EC2 or OpenShift security for services including SSH, Oauth2, and HTTPS.
Google and Mozilla data syncing for user settings and history.
Salted and hashed messages passed to front end for csrf.

#### 3.2.3    Usability, Reliability, Compliance


### 3.3 External Interface Requirements

#### 3.3.1    Performance Requirements

#### 3.3.2    Safety Requirements

CSS animations do not cause jittery effects or stuttering, but overloaded websites could slow the animation performance and induce this. Epilepsi warnings should be agreed to before use.

Epilepsi warning checkbox and signoff.
Epilepsi site reporting and safety features like an epilepsi safe or block list.

#### 3.3.3    Security Requirements

OAuth2 for user presence if available for premium features.
HTTPS, SSH and no PII spread including user history, unless consented to for research.

#### 3.3.4    Software Quality Attributes

Playwright and jest testing.

#### 3.3.5    Business Rules

Free to use with donations. Premium features may require donation to use down the line and store user presence.

### 3.4 System Features

## 4. Other Requirements

### 4.1 Database Requirements

Persistant storage to be decided, currently an sql connector via kotlin backend.

### 4.2 Legal and Regulatory Requirements

Epilepsi warning. Content ownership for sites manipulated is CSS only and perceptual, no edits beyond font family or placement outside of CSS written by users are made.

### 4.3 Internationalization and Localization

Movement may have to switch from horizontal to vertical.

### 4.4 Risk Management (FMEA Matrix)

## 5. Appendices

### 5.1 Glossary

### 5.2 Use Cases and Diagrams

### 5.3 To Be Determined (TBD) List
