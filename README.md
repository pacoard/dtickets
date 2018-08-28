# dtickets
ConsenSys Academy 2018 Final Project: Decentralized marketplace for tickets. Ethereum, Solidity, Blockchain, IPFS, ReactJS

This project shows a proof of concept of a decentralized ticket sale. The tickets can be used for any type of event, and are modeled as ERC721 tokens (see Cryptokitties and CryptoZombies). As the owner of the sale, a user can manage the state of the sale, manipulate its price, add tickets, change metadata and withdraw all the raised funds.

## Installation

1. Install the latest versions of NPM, Truffle and Node globally, if you haven't installed them yet.
    ```javascript
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs
    npm install -g truffle
    ```

2. Clone this repository and enter it.
    ```javascript
    git clone https://github.com/pacoard/dtickets.git
    cd dtickets
    ```

3. Install the EthPM packages.
    ```javascript
    truffle install
    ```

4. Compile, deploy and test them. The easiest way is through the Truffle develop console, but I recommend having Ganache ready and deploy the contracts to it in order to test them later from the UI.
    ```javascript
    truffle develop
    > compile // warnings from the installed contracts will appear. It's deprecated code from OpenZeppelin
    > migrate --reset //clean other possible migrations
    > test

    // Alternatively
    truffle compile
    truffle migrate --reset
    truffle test
    ```
A note on the tests: Although you can only see 5 tests in total, take into the account the code and the amount of `asserts` and `expects` that there are. The majority of the tests were heavily focused on the contract TicketSale, as the rest of the contracts were imported from OpenZeppelin and are known to be very secure.


5. Install the frontend app (takes a few minutes). If you run into errors such as EACCESS or ENOENT, put `asserts` at the beggining of the command. 
    ```javascript
    npm install
    ```

6. Start Webpack to be able to access the UI from the browser.
    ```javascript
    npm start
    ```
If this this doesn't work for any reason, please do not hesitate to contact me. I have an EC2 instance in AWS ready to serve the UI. Shoot me a message to <pacoard@gmail.com> and I'll give that server a kick.

7. Interact with the smart contracts from the UI. You must use MetaMask + Ganache to interact with the locally deployed contracts.