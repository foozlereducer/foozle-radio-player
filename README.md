<h1>Foozle Radion</>
<h2>Description</h2>
<p>The foozle radio is a quick Vue3 and Express/Node.js app that allows
a user to put a contry and get 20000 radio station that can be filtered.
It attempts to download album art and track meta data; it does this using web sockets.
It also trys to get the current song's streamed progress. </p>

<p>This is not an overall complex build and you can learn how some of the more advanced 
logic works by the unit tests; AVA for the backend tests and ViTest for the frontEnd tests.</p>

<h2>Configuration<h2>
<p>You will either need to get a https certificate (Let's Encrypt) or generate a local cert and place the certs in the /backend/bin folder named localhost.crt, localhost.csr, and localhost.key; otherwise you will need to update where you store certs in file /backend/server.js and frontend's  vite.config.js</p>

<h2>How to run<h2>
<ol>
<li>Clone or pull the repo to a local or a server directory</li>
<li>Start the backend first, change directory to the backend folder 
<code>
~ cd backend
~ npm start
</code>
</li>
<li>Start tthe frontend next, change directory to the frontend folder
<code>
~ cd frontend
~ npm dev start
</code>
<li/>
</ol>
<style>
    font-size: 0.8em;
</style>