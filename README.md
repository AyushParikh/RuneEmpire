# OSRSCasino

> to run the file locally you need to run `npm i` in 3 locations

1. in the root osrs casino folder
2. in the client folder
3. in the server folder

> from there you can rum npm start in the root folder to run the program with the client side and server side.

# Server

> the server uses socket.io and can somtimes disconnect a user if left alone too long this is because the sever is not hosted and currenty
> only runs on your local machine to fix this just refresh the page

# Client

> the client is currently PC combatibly only as making the games work on a phone screen caused many issues. To run the website on your phone
> you can however put you phone into desktop mode. (in the settings on your preferred browser)

# Production Build

1. cd into the client folder and run `npm run build`
2. after the builf folder is created copy it into the server folder and rename to `client`
3. npm start in the server folder. The website will now be running at `http://localhost:4000/`

> These are also the steps needed for hosting the website. After these steps the server folder can now be hosted on a provider like AWS.

**_ I hope you enjoy the website _**
