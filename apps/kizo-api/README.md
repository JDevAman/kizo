# Kizo - API

Backend service for Kizo, a digital wallet platform similar to Paytm.
It enables users to add or withdraw funds via net banking and transfer money to other users or merchants.

## Overview

This repository contains the backend for kizo-users, handling authentication, user management, wallet operations, and secure transactions.

## Progress

### Modules

1. Auth
   [x] signin
   [x] signup
   [x] logout
   [x] refresh

2. User
   [] getMe
   [] updateProfile
   [] bulkSearch

3. Payment
4. Transaction

## FLOW

### AUTH

1. User SignUp ->
   1. Req: Email, Password, FirstName, LastName
   2. Response: User:{firstname, lastname, email, role, avatarUrl} , AccessToken, RefreshToken
2. User Signin ->
   1. Req: Email, Password
   2. Response: access_token: , user: {id, email, role}

### USER

1. getMe:
   1. Request: access_token
   2. Response: User:{id, firstname, lastname, email, role, avatarUrl}

### PAYMENT

### TRANSACTION
