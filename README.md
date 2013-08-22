storage.js
=========

storage.js is a free and open source JavaScript class for HTML5 storage management. Using syntax and methods similar to SQL.

This is a client database storage and can only be used within your browser. Good for caching server side data.

Examples
=========

Connecting to the host (local or session):

```javascript
var conn = easydb.connect("local");
if(!conn) {
	console.log("Cannot connect to HTML5 Storage, upgrade your browser to support it.");
}
```

Selecting a database and creating it if it does not exist:

```javascript
if(!easydb.database("zendos")) {
	easydb.create("database", "zendos");
}
var db = easydb.database("zendos");
```

Creating tables:

```javascript
if(!db.table("accounts")) {
	db.create("table", 'accounts');
}
```

Inserting a record into the table:

```javascript
db.table("accounts").insert({ id: "auto", name: "Adam", money: 30, gender: "Male" }).execute();
```

Updating a record:

```javascript
db.table("accounts").set({ money: 30 }).where({ name: "Adam" }).execute();
db.table("accounts").set({ money: "+=30" }).where({ name: "Adam" }).execute();
db.table("accounts").set({ money: "-=10" }).where({ name: "Adam" }).execute();
```

Retrieving records:

```javascript
var results = db.table("accounts").get("*").where({ name: "Adam" }).execute();
var results = db.table("accounts").get("*").where({ name: "Adam", money: 30 }).execute();
var results = db.table("accounts").get("*").limit(10).orderby("name").execute();
var results = db.table("accounts").get("name").execute();
```

Deleting records:

```javascript
db.table("accounts").del("*").where({ id: 0, name: "adam" }).execute();
db.table("accounts").del("*").where({ money: 1000000000, gender: "Male" }).execute();
```

Importing and Exporting as objects:

```javascript
var exported = db.export_db();
db.import_db(OBJECT);
```

Emptying a table:

```javascript
db.table("accounts").truncate();
```

Deleting a table:

```javascript
db.table("accounts").drop();
```

Checking if table is empty:

```javascript
if(db.table("accounts").empty()) {
  // returns true or false
}
```

Possible Future Work
=========

* Store each database into the web storage individually for faster performance and loading times.
* More operators: !=, *=, etc.

Benefits
=========

* Cache server-side data, such as account information. Reduce data coming from the server.
* Easy to learn and use.

Limitations
=========

* Only works with HTML5 browsers.
* Cannot contain lots of data. Size is limited.
* The limitations with web storage.

Browser Support
=========

Firefox 3.5+, Chrome 2+, Safari 4+ and MSIE 8+.

MIT License
=========

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

