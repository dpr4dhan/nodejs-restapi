const {create, getUsers, getUserById, update, destroy, getUserByEmail} = require('./user.service');
const {genSaltSync, hashSync, compareSync} = require('bcrypt');
const {sign} = require('jsonwebtoken');

module.exports = {
    createUser : (req, res) => {
        const body = req.body;
        const saltRounds  = genSaltSync(10);
        body.password = hashSync(body.password, saltRounds);
        getUserByEmail(body.email, (err, results) => {
            console.log(results);
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred"
                })
            }
            console.log(results);
            if(results.length >= 1){
                return res.status(422).json({
                    success: false,
                    message: "Email has already been used."
                })
            }
            create(body, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error occurred"
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: "User created successfully",
                    data: results
                })
            } );
        });

    },

    getAllUsers: (req, res) => {
        getUsers((err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred"
                })
            }
            return res.status(200).json({
                success: true,
                message: "User list fetched successfully",
                data: results
            })
        } );
    },

    getSingleUser: (req, res) => {
        const id = req.params.id;
        getUserById(id,(err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred"
                })
            }
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: results
            })
        } );
    },

    updateUser: (req, res) => {
        const body = req.body;
        const id = req.params.id;
        body.id = id;
        getUserById(id,(err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred"
                })
            }
            if(results.length === 0){
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                })
            }else{
                update(body, (err, results) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            message: "Error occurred"
                        })
                    }
                    return res.status(200).json({
                        success: true,
                        message: "User updated successfully",
                        data: results
                    })
                } );
            }
        } );

    },

    deleteUser: (req, res) => {
        const id = req.params.id;
        getUserById(id,(err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred"
                })
            }
            if(results.length === 0){
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                })
            }else{
                destroy(id, (err, results) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            success: false,
                            message: "Error occurred"
                        })
                    }
                    return res.status(200).json({
                        success: true,
                        message: "User deleted successfully",
                        data: results
                    })
                } );
            }
        } );

    },

    login: (req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
           if(err){
               console.log(err);
           }
           if(results.length === 0){
               return res.status(422).json({
                   success: false,
                   message: "Invalid email or password"
               })
           }
           const result  = compareSync(body.password, results[0].password);
           if(result){
               results.password = undefined;
               const jsontoken = sign({result: results}, process.env.ENCRYPTION_KEY, {
                   expiresIn: "1h"
               });
               return res.status(200).json({
                   success: true,
                   message: "Logged in successfully",
                   token: jsontoken
               })
           }else{
               return res.status(422).json({
                   success: false,
                   message: "Invalid email or password"
               })
           }
        });
    }
}