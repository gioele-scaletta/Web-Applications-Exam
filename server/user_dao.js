  
'use strict';
const sqlite = require('sqlite3');
const db = require('./db');

const bcrypt = require('bcrypt');

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE username = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.username};
                
        bcrypt.compare(password, row.hash).then(result => {
          if(result)
        resolve(user);
        resolve(false);
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, username: row.username};
        resolve(user);
      }
    });
  });
};