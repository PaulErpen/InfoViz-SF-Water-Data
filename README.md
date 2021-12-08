# InfoViz San Francisco Water Quality

In order to run the server you need to execute the following commands in the root directory of this project.
You will need to have npm and node installed.

## Building and Running

Initialize the server and download all the dependencies with:
```
npm init
```

Start the server:
```
npm start
```

When you make code changes to the backend restart the server.
When you make changes to the frontend, thats anything in the "src"-directory you need to recompile the js:
```
npm run build
```

## Deployment

To deploy use:
```
gcloud app deploy
```

Afterwards you can use the following command to view the deployed web app.

```
gcloud app browse
```