This is the backend server for RudderStack assignment.

This app is a simple `nodejs` server with `experss` and `SQLite` database using `sequilize` as ORM layer. Users can create new `Templates` with different `Fields` and create Data `Sources` with a specific `Template`

To create a `Source` via UI, follow this [link](https://github.com/zkhil1/rudderstack-react-frontend)

## Getting Started

Prerequisites: Install `nodejs`. You can follow the offical [guide](https://nodejs.org/en/download) or use `nvm`


Clone the repository locally.
To install dependencies, run

```bash
npm install
```

To start local server, run

```bash
npm run dev
```

This will start a local server at [http://localhost:3001](http://localhost:3001)

## APIs

Couple of important APIs are listed here. You can check `index.ts` for all the APIs

- **POST** `/fields` Create a new data field to be associated wiith a template
Request Body
```json
{
    "name": "apiKey",
    "input_type": "text",
    "label": "API key",
    "regexErrorMessage": "Invalid api key",
    "placeholder": "e.g: 1234asdf",
    "regex": "[a-z0-9]",
    "required": true
}
```

- **POST** `/templates` Create a new template, templates are logical grouping of different fields
Request Body:
```json
{
    "name": "Template 1",
    "fields": [1,2,3]
}
```

- **POST** `/sources` Create a data source config with a given template
Request Body:
```json
{
    "name": "Source 1",
    "templateId": 1,
    "fields": [{
        "id": 1,
        "value": "APK_Key"
    }, {
        "id": 2,
        "value": true
    }, {
        "id": 3,
        "value": "android"
    }]
    
}
```

- **PUT** `/sources` Update existing source
Request Body:
```json
{
    "id": 1,
    "name": "Source 1",
    "templateId": 1,
    "fields": [{
        "id": 1,
        "value": "APK_Key"
    }, {
        "id": 2,
        "value": true
    }, {
        "id": 3,
        "value": "android"
    }]
    
}
```

- **DELETE** `/source/:sourceId` Delete source
