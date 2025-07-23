import express from 'express';

const wrapController = <T extends (...args: any[]) => any>(handler: T): express.RequestHandler =>  handler as express.RequestHandler;

export default wrapController
