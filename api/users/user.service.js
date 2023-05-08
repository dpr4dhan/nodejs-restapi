const pool = require('../../config/database');

module.exports = {
   create: (data, callBack) => {
       pool.query(`insert into users (first_name, last_name, email, gender, mobile, password) values (?,?,?,?,?,?)`,
           [
               data.first_name,
               data.last_name,
               data.email,
               data.gender,
               data.mobile,
               data.password,
           ], (error, results, fields) => {
               if(error){
                  return callBack(error);
               }
               return callBack(null, results);
           });
   },

   getUsers: callBack => {
        pool.query(`select id, first_name, last_name, email, gender, mobile from users`, [], (error, results, fields) => {
            if(error){
                return callBack(error);
            }
            return callBack(null, results);
        })
   },

    getUserById: (id,callBack) => {
        pool.query(`select id, first_name, last_name, email, gender, mobile from users where id = ?`, [id], (error, results, fields) => {
            if(error){
                return callBack(error);
            }
            return callBack(null, results);
        })
    },

    update: (data, callBack) => {
       pool.query(`update users set first_name=?, last_name = ?, email=?, gender=?, mobile=? where id= ?`,
           [
               data.first_name,
               data.last_name,
               data.email,
               data.gender,
               data.mobile,
               data.id
           ], (err, results,fields) => {
                if(err){
                    return callBack(err);
                }
                return callBack(null, results);
           })
    },

    destroy: (id, callBack) => {
        pool.query(`delete from users where id= ?`,
            [
                id
            ], (err, results,fields) => {
                if(err){
                    return callBack(err);
                }
                return callBack(null, results);
            });
    },

    getUserByEmail: (email, callBack) => {
        pool.query(`select * from users where email = ?`, [email], (error, results, fields) => {
            if(error){
                return callBack(error);
            }
            return callBack(null, results);
        })
    }
 };