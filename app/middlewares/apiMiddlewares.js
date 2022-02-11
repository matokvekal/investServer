import express from 'express';
import cors from 'cors';
import Parsing from './payloadParsing';
// import checkAuthentication from './authenticationMiddleware';
import config from "../config";

const origin = config.allowedOrigins.split(',');

const middlewares = [
    cors({ credentials: true, origin }),
    express.urlencoded({ extended: true }),
    express.json(),
    // Parsing,
    // Rest,

];

export default middlewares;
