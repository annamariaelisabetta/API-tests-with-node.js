import { expect } from "chai";
import pkg from 'pactum';
const { spec } = pkg;
import { baseUrl, userID, user, password } from "../helpers/data.js";

let token_response;
describe("Api tests", () => {
    it("get request", async() => {       
        const response = await spec()
        .get(`${baseUrl}/BookStore/v1/Books`)
        .inspect()
        const responseB = JSON.stringify(response.body)
        //console.log("is dotenv works? " + process.env.SECRET_PASSWORD)
        expect(response.statusCode).to.eql(200)
        expect(responseB).to.include("Learning JavaScript Design Patterns")
        expect(response.body.books[1].title).to.eql("Learning JavaScript Design Patterns")
        expect(response.body.books[4].author).to.eql("Kyle Simpson")
    });

    it.skip("Create a user", async () => {
        const response = await spec()
        .post(`${baseUrl}/Account/v1/User`)
        .inspect()
        .withBody({
            userName: "tester0",
            password: process.env.SECRET_PASSWORD
        })
        expect(response.statusCode).to.eql(201)
    });

    it("Generate token", async () => {
        const response = await spec()
        .post(`${baseUrl}/Account/v1/GenerateToken`)
        .withBody({
            userName: user,
            password: password
        })
        .inspect()
        token_response = response.body.token
        console.log(token_response)
        expect(response.statusCode).to.eql(200)
        expect(response.body.result).to.eql("User authorized successfully.")
    })

    // it.only("check token", async () => {
    //     console.log("another it block " + token_response)
    // })

    it("Add a book", async () => {
        const response = await spec()
        .post(`${baseUrl}/BookStore/v1/Books`)
        .withBearerToken(token_response)
        .inspect()
        .withBody({
            "userID": userID,
            "collectionOfIsbns": [
                {
                    "isbn": "9781593277574"
                } 
            ] 
        })
        expect(response.statusCode).to.eql(201)
        //expect(response.body.result).include("9781593277574")
    })

    it("Check books for user", async () => {
        const response = await spec()
        .get(`${baseUrl}/Account/v1/User/{UUID}`)
        .withBearerToken(token_response)
        .inspect()
        .withBody({
            "userID": userID
        })
        expect(response.statusCode).to.eql(200)
    })

    it("Delete books for user", async () => {
        const response = await spec()
        .delete(`${baseUrl}/Bookstore/v1/Books`)
        .withBearerToken(token_response)
        .inspect()
        .withBody({
            "userID": userID
        })
        expect(response.statusCode).to.eql(204)
    })
})