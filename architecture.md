# Architecture #
## Server ##
### Areas ###
- routing
- db connection
- layouts
- views

### A layout ###
- is tied to one or more top level routes
- is only html structure and style hooks (no strings, assets)

### A view ###
- is anything that contains a message seen by the end user
- is inserted in a layout part
- is tied to a unique id or hash based on a few factors
- can contain assets, strings
- composes client components

## Client ##
### Areas ###
- global styles
- layout styles
- view styles
- components
- router hotswap
- state machine for temporary data

### Simple components ###
- CANNOT contain messages
- CAN have minimal state based on inputs
- MUST be themable
- MUST be single purpose

### Complex components ###
- CANNOT contain strings
- CAN have slots for simplecomponents and strings
- CANNOT be themable
- CAN take complex state
- CAN fire events
- CAN repeat over simple components or templates, but should be kept to a minimum
- CANNOT contain multiple views, must delegate to sub routing
- CANNOT contain assets

### Server side router requirements ###
- MUST serve a layout
- MUST populate layout areas with relevant views
- CAN cache layout and views
- CAN provide bootstrapped state for client

### Stack example (v0) ###
- Server: NodeJS with express
- Server - templating: EJS
- Server - localization: ICU with intl-messageformat-parser
- DB: MongoDB
- Client - components: Polymer + lit-html
- Client - state: Microstates.js
- Client - dates: date-fns
- Client - localization: ICU intl-messageformat
- Client - language: none, es6 only
- Client - polyfills: es6, css custom properties
- Testing: Jest
- Grid system: mobile first fallback with native css grids enhancement
- Style preprocessor: native css custom properties, with autoprefixer
- CI: Travis

### Application requirements ###
- Client max size: 50kb gzipped
- 