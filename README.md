# IRL-Paperspace-automation
automates the reservation process for paperspace machines

#Development/Testing setup
- clone repository to project folder
- Within ./Back-end, and ./Front-end, run npm install to install dependencies
- To start back-end, run _npm start_ in ./Back-end
  - Default set to localhost:8080
  - ONCE APP IS RUNNING: Swagger-UI API Docs found [here](http://localhost:8080/api-docs)
- To start front-end, run _npm start_ in ./Front-end,
  - Default set to localhost:3000
  - To build/serve, run _npm run-script build_ then _serve -s build_ Defaults to localhost:5000
  
  #Backend .env
  - PAPERSPACE_API_KEY
  - DEFAULT_USER
  - DEFAULT_PASSWORD
  - JWT_SECRET
  - WEBCHECKOUT_UN
  - WEBCHECKOUT_PWD
  - WEBCHECKOUT_HOST
  
  #Frontend .env
  - REACT_APP_LOGIN_URL
  - REACT_APP_API_URL
  
For documentation, see /Back-end/designDocs for flow charts, go to [localhost:8080/api-docs](http://localhost:8080/api-docs) to see API and examples while running locally.

