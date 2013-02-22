var easydb = {
	_table: null, _table_name: null, _set: null, _get: null, _where: null, _order: null, _sort: null, _limit: null, _insert: null, _del: null,
	_storage: null, _database: null, _database_name: null,
	connect: function(p) {
		if(typeof(Storage)==='undefined') return false;
		switch(p) {
			case "localhost":
			case "localStorage":
			case "local":
				this._storage = window.localStorage;
				return true;
				break;
			case "sessionhost":
			case "sessionStorage":
			case "session":
				this._storage = window.sessionStorage; 
				return true;
				break;
		}
		return false;
	},
	import_db: function(p) {
		if(this._storage == null) return false;
		if(typeof(p)=='object') {
			this._storage.setItem('zdb',JSON.stringify(p));
			return true;
		}
		return false;
	},
	export_db: function() {
		if(this._database == null) return false;
		return this._database;
	},
	database: function(p) {
		if(this._storage == null) return false;
		this._database_name = p;
		if(!this._storage.getItem('zdb')) {
			var zdb = {};
			this._storage.setItem('zdb',JSON.stringify(zdb));
		}
		var zdb = JSON.parse(this._storage.getItem('zdb'));
		for(var database in zdb) {
			if(database == p) {
				this._database = zdb[database];
				return this;
			}				
		}				
		return false;
	},
	table: function(p) {
		if(this._database == null || typeof(this._database) === "undefined") return false;
		for(var table in this._database) {
			if(table == p) {
				this._table = this._database[table];
				this._table_name = p;
				return this;
			}
		}
		return false;
	},
	set: function(p) {
		if(p instanceof Object) this._set = p; 
		return this;
	},
	get: function(p) {
		if(p) this._get = p; 
		return this;
	},
	where: function(p) {
		if(p instanceof Object) this._where = p; 
		return this;
	},
	orderby: function(p, p2) {
		if(p) this._order = p;
		if(p2) this._sort = p2; 			
		return this;
	},
	limit: function(p) {
		if(p) this._limit = p; 
		return this;
	},
	insert: function(p) {
		if(p) this._insert = p;
		return this;
	},
	num_rows: function(p) {
		var size = 0;
		for(var key in p) {
			if(p.hasOwnProperty(key)) size++;
		}
		return size;
	},
	save: function() {
		var zdb = JSON.parse(this._storage.getItem('zdb'));
		zdb[this._database_name] = this._database;
		this._storage.setItem('zdb',JSON.stringify(zdb));
		return this;
	},
	reset: function() {
		this._table = null, this._set = null, this._get = null, this._where = null, this._sort = null, this._order = null, this._insert = null, this._table_name = null, this._del = null;
		return this;
	},
	create: function(p, pp) {
		switch(p) {
			case 'table':
				this._database[pp] = {};
				this.save().reset();
				return pp;
				break;
			case 'database':
				var zdb = JSON.parse(this._storage.getItem('zdb'));
				zdb[pp] = {};
				this._storage.setItem('zdb',JSON.stringify(zdb));
				return pp;
				break;
		}
		return false;
	},
	del: function(p) {
		if(p) this._del = p; 
		return this;
	},
	drop: function() {
		if(this._table_name == null) return false;
		delete this._database[this._table_name];
		this.save().reset();
		return true;
	},
	truncate: function() {
		if(this._table_name == null) return false;
		this._database[this._table_name] = {};
		this.save().reset();
		return true;
	},
	empty: function() {
		if(this._table_name == null) return false;
		if(this.num_rows(this._database[this._table_name]) == 0) {
			return true;
		}
		return false;
	},
	execute: function(p) {
		if(this._table == null || typeof(this._table) === "undefined") return false;
		if(this._del != null) {
			for(var field in this._table) {
				if(this._table.hasOwnProperty(field)) {
					if(this._where == null) {
						if(this._del == "*") {
							delete this._table[field];
						} else {
							if(this._table[field][this._del]) {
								delete this._table[field][this._del];
							}
						}
					} else {
						if(this.objectContains(this._table[field], this._where)) {
							if(this._del == "*") {
								delete this._table[field];
							} else {
								if(this._table[field][this._del]) {
									delete this._table[field][this._del];
								}
							}
						}
					}
				}
			}	
			this.save().reset();
			return true;				
		}
		if(this._insert != null) {
			var num = this.num_rows(this._table);
			this._table[num] = {};
			for(var field in this._insert) {
				if(this._insert.hasOwnProperty(field)) {
					if(this._insert[field] == 'auto') this._insert[field] = num; 
					this._table[num][field] = this._insert[field];
				}
			}
			this.save().reset();
			return true;
		}
		if(this._set != null) {
			for(var field in this._table) {
				if(this._table.hasOwnProperty(field)) {
					if(this._where == null) {
						for(var sfield in this._set) {
							if(this._set.hasOwnProperty(sfield)) {
								if(this._table[field][sfield]) this._table[field][sfield] = this.stringOperator(this._set[sfield], this._table[field][sfield]);
							}
						}				
					} else {
						if(this.objectContains(this._table[field], this._where)) {
							for(var sfield in this._set) {
								if(this._set.hasOwnProperty(sfield)) {
									if(this._table[field][sfield]) this._table[field][sfield] = this.stringOperator(this._set[sfield], this._table[field][sfield]);
								}
							}
						}
					}
				}
			}
			this.save().reset();
			return true;
		}
		if(this._get != null) {
			var results = [];				
			for(var field in this._table) {
				if(this._table.hasOwnProperty(field)) {
					if(this._where == null) {
						if(this._get == "*") {
							results.push(this._table[field]);
						} else {
							if(this._table[field][this._get]) {
								results.push(this._table[field][this._get]);
							}
						}
					} else {
						if(this.objectContains(this._table[field], this._where)) {
							if(this._get == "*") {
								results.push(this._table[field]);
							} else {
								if(this._table[field][this._get]) {
									results.push(this._table[field][this._get]);
								}
							}
						}
					}
				}
			}				
			if(this._order == null) {
				if(this._limit != null) results = results.slice(0, this._limit);
				this.reset();
				return results;
			} else {
				var sorted = [], newResults = [];
				for(var result = 0, rl = results.length; result < rl; result++) {
					sorted.push([results[result][this._order] || results[result], result]);
				}
				if(this._sort != null) {
					this._sort = this._sort.toLowerCase();
					switch(this._sort) {
						case "ascending":
						case "asc":
							sorted.sort();
							break;
						case "descending":
						case "desc":
							sorted.sort(), sorted.reverse();
							break;
						default:
							sorted.sort();
					}
				} else {
					sorted.sort();
				}
				for(var val = 0, vl = sorted.length; val < vl; val++) {
					for(var result = 0, rl = results.length; result < rl; result++) {
						if(result == sorted[val][1]) {
							newResults.push(results[result]);
						}
					}
				}
				if(this._limit != null) newResults = newResults.slice(0, this._limit);
				this.reset();
				return newResults;
			}
		}
		return false;
	},
	stringOperator: function(p, val) {
		if(String(p).substring(0,2)=='+=') {
			if(p.indexOf("px") !== -1) {
				return parseFloat(val) + parseFloat(p.substr(2)) + 'px';	
			} else {
				return (p.substr(2)==parseFloat(p.substr(2)) && val==parseFloat(val)) ? parseFloat(val) + parseFloat(p.substr(2)) : val + p.substr(2);	
			}
		}
		if(String(p).substring(0,2)=='-=') {
			if(p.indexOf("px") !== -1) {
				return parseFloat(val) - parseFloat(p.substr(2)) + 'px';	
			} else {
				return (p.substr(2)==parseFloat(p.substr(2)) && val==parseFloat(val)) ? parseFloat(val) - parseFloat(p.substr(2)) : val - p.substr(2);	
			}
		}
		return p;
	},
	objectContains: function(obj, obj2) {
		return Object.keys(obj2).every(function(key) {
			return obj[key] == obj2[key];
		});
	}
};