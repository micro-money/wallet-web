<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :fullscreen="true"
    custom-class="dialog terms"
    title="Terms of Service and Privacy Policy"
    center>
    <div class="text">
      <p>
        Dear User,
      </p>
      <p>
        Thank you for choosing Platinum Wallet. This Platinum Wallet Terms of
        Service (“Agreement”) is made between you (“User”) and Platinum company
        LTD., a company incorporated in Seychelles and having its registered
        address at Global Gateway 8, Rue de la Perle, Providence, Mahe, Seychelles
        (“Company”) and is legally binding between you and Company. In this
        Agreement (a) “we” and “us” refer to the Company and “our” shall be
        construed accordingly; and (b) “you” refers to User and “your” shall be
        construed accordingly; (c) virtual currency (the "Currency") is a virtual
        peer-to-peer currency, including Bitcoins, Litecoin, etc.; (d)
        wallet.gatei.co (the "Website" or the "Wallet") is an online Wallet for
        holding, sending and receiving the Currency. Each of you and the Company
        shall hereinafter be referred to as a “Party”, and collectively, you and
        the Company shall hereinafter be referred to as the “Parties”.
      </p>
      <p>
        Company hereby reminds you that you must carefully read the full content of
        this Agreement and other documents mentioned in this Agreement before
        registering to and using Website or using our mobile application “AMM
        Platinum Wallet” available on various mobile platforms including but not
        limited to Google Play and Apple App Store (“AMM Platinum Wallet” or
        “App”). In particular, you must carefully read the section of “Disclaimer
        and Limitation of Liability” and other sections which are displayed in bold
        in this Agreement. You must make sure that you fully understand the whole
        Agreement and evaluate the risks of using Platinum Wallet on your own.
      </p>
      <br>
      <h2>
        I. Confirmation and Acceptance of this Agreement
      </h2>
      <p>
        1.You understand that this Agreement and other relevant documents apply to
        Platinum Wallet and the Decentralized Applications (“DApps”) which are
        developed and owned independently by Company on Platinum Wallet (and
        excluding DApps developed by third parties).
      </p>
      <p>
        2. By registering to and using the Platinum Wallet, you agree to be bound
        by and accept this Agreement, its terms and conditions and all the policies
        and guidelines that are incorporated by reference (for example, the Privacy
        Policy, the Acceptable Use Policy). If you do not agree with the Agreement
        and/or individual provisions of the Agreement, you cannot use the Platinum
        Wallet.
      </p>
      <p>
        3. In accessing or using Platinum Wallet, you agree:
      </p>
      <ul>
        <li>
          <p>
            a) to be bound by the latest version of this Agreement without
            variation or modification;
          </p>
        </li>
        <li>
          <p>
            b) that in the jurisdiction to which you are subject, you are of
            legal age to use Platinum Wallet and to create binding legal and
            financial obligations for any liability you may incur as a result
            of the use of Platinum Wallet; and
          </p>
        </li>
        <li>
          <p>
            c) you are not an Excluded Person (as defined herein).
          </p>
        </li>
      </ul>
      <p>
        4. Company may, at its sole discretion, modify or replace this Agreement at
        any time. The modified Agreement will automatically take effect once it is
        posted on Platinum Wallet and you will not be notified separately. If you
        do not agree with the modifications, you shall cease to use Platinum Wallet
        immediately. Use of Platinum Wallet by you after any modification to this
        Agreement constitutes your acceptance of this Agreement as modified.
      </p>
      <p>
        5. This Agreement comes into effect at the moment you register at the
        Wallet.
      </p>
      <br>
      <h2>
        II. Definition
      </h2>
      <p>
        1. Platinum Wallet: means the blockchain wallet developed by Company based
        on blockchain systems and other supporting tools which are developed for
        the convenience of the Users when using blockchain systems.
      </p>
      <p>
        2. Excluded Person:
      </p>
      <p>
        a) a person other than a natural person who possesses legal and mental
        capacity to enter into this Agreement; or
      </p>
      <p>
        b) a User who is prohibited, restricted, unauthorized or ineligible in any
        form or manner whether in full or in part under this Agreement, laws,
        regulatory requirements, or rules in the jurisdiction applicable to such
        User, to use the Services (as defined below).
      </p>
      <p>
        3. Identity: means the blockchain identity generated from a pair of your
        Public Key and Private Key.
      </p>
      <p>
        4. Beginner’s Guide: means the operation guide provided by the Company
        before you start to use Platinum Wallet (and during your future use of
        Platinum Wallet). This Beginner’s Guide would help you understand the basic
        knowledge about blockchain.
      </p>
      <p>
        5. Create or import wallet: means your use of Platinum Wallet to create or
        import wallet after your acceptance of this Agreement.
      </p>
      <p>
        6. User account: means the main interface of the wallet. You must be
        registered and authorized to have an access to user account. Any assets
        management in Wallet are possible only with your Mnemonic Words.
      </p>
      <p>
        7. Alert: means the messages displayed on Platinum Wallet`s operation
        interface which provides suggestions for Users on subsequent operations.
      </p>
      <p>
        8. Specific Users: means Users who should cooperate with Company and
        disclose Personal Information in order to comply with the laws, regulations
        and policies of Singapore and other countries.
      </p>
      <p>
        9. Private Key: consists of 256 random bits. Private Key is the core for
        the User to hold and use the Tokens.
      </p>
      <p>
        10. Public Key: is derived from the Private Key based on cryptography and
        is used to generate wallet addresses. A wallet address is a public address
        for receipt of Tokens.
      </p>
      <p>
        11. Mnemonic Words: consists of 12 (or 15/18/21/24) words which are
        randomly generated, and it is based on BIP39, the industry standard of
        blockchain. It is a human readable format of words to back up your Private
        Key for recovery. Platinum Wallet does not store mnemonic words associated
        with Wallet on the Company’ servers.
      </p>
      <p>
        12. Keystore: means Private Key in the format of a file which is encrypted
        and protected by the User’s Mnemonic Words. Keystore is stored only in your
        mobile device and will not be synchronized to the Company’ servers.
      </p>
      <p>
        13. Tokens: means the tokens which are supported by Platinum Wallet
        currently, including but not limited to BTC, ETH, DGD and so on.
      </p>
      <p>
        14. Materials: means contents in the columns of “Portfolio”, “Marketplace”
        etc. on Platinum Wallet. The Materials are third parties’ proprietary
        properties. User shall not reproduce or distribute the materials without
        their permission and authorization. Foregoing Materials are solely for your
        reference and shall not be considered as guidance or advice on your
        transactions provided by Company.
      </p>
      <p>
        15. Personal Information: means information recorded in electronic or any
        other form which may identify a natural person when used alone or in
        combination with other information, including but not limited to name, date
        of birth, identification card number, personal biological identification
        information, address, telephone number, bank card number, e-mail address,
        wallet address, mobile device information, operation record, transaction
        record, but excluding Private Key, Mnemonic Words and Keystore.
      </p>
      <p>
        16. Smart Contract: means the type of Smart Contract operating on Ethereum
        blockchain and spreading, verifying and executing contracts via information
        methods, including but not limited to Smart Contract Kyber and/or Smart
        Contract 0x as hereinafter mentioned. Smart Contracts integrated on
        Platinum Wallet do not provide cross-blockchain services.
      </p>
      <p>
        17. WETH: means the tokenization of ETH. Because ETH does not satisfy its
        ERC20 standard, ETH is packaged via the means of tokenization to be used
        for direct transactions with other Tokens. The exchange rate between Tokens
        supported by Platinum Wallet and WETH is decided by the
        third-party-developed Smart Contracts.
      </p>
      <p>
        18. ETH means Ether, the cryptographic token associated with the Ethereum
        blockchain, which for the avoidance of doubt does not include “Ethereum
        Classic”.
      </p>
      <br>
      <h2>
        III. Platinum Wallet Services (collectively, the “Services”)
      </h2>
      <p>
        1. Registration. If you want to start using the Wallet, you must register
        at the Website or in App. After you agree to be bound by this Agreement and
        complete the registration form, Platinum Wallet will establish an account
        for you (the "Account") and provide you with the E-mail and password.
        Platinum Wallet is entitled to refuse to register a new User without
        indicating the reasons.
      </p>
      <p>
        2. Import wallet. You may use Platinum Wallet to create a new wallet or
        import wallets generated by other wallet application. You may only import
        wallets with Tokens which are supported by Platinum Wallet.
      </p>
      <p>
        3. Send and receive Tokens. You may manage your digital Tokens by using the
        transfer and receipt functionalities of Platinum Wallet, i.e., you may
        revise the blockchain ledger by signing with your Private Key. Transfer of
        Tokens means the payer’s transfer of the Token to the ENS domain or
        blockchain address of the payee. Such “transfer” of Tokens involves a
        validated record of such transaction on the distributed ledger of the
        relevant the blockchain system (rather than an actual delivery or transfer
        of Tokens on Platinum Wallet).
      </p>
      <p>
        4. Manage Tokens. You may use Platinum Wallet to add, manage or delete the
        Tokens (except ETH and BTC) supported by Platinum Wallet.
      </p>
      <p>
        5. Transaction records. We will copy all or part of your transaction
        records from the blockchain system. However, Users shall refer to the
        blockchain system for the latest transaction records.
      </p>
      <p>
        6. Suspension of service. You understand that we are not able to reverse or
        cancel the transaction because transactions based on blockchain
        technologies are irrevocable. However, under certain circumstances, we may
        suspend or limit the function of Platinum Wallet used by a particular User.
      </p>
      <p>
        7. Other services that Company would like to provide.
      </p>
      <p>
        Users who use Platinum Wallet acknowledges and accepts that:
      </p>
      <p>
        1. In order to keep the decentralization feature of blockchain and to
        protect the security of your digital Tokens, Company offers decentralized
        service which is largely different from the banking and financial
        institutions. Users acknowledge and accept that the Company SHALL NOT have
        any responsibility to :
      </p>
      <ul>
        <li>
          <p>
            a) store Users’ Private Key, Mnemonic Words or Keystore;
          </p>
        </li>
        <li>
          <p>
            b) recover Users’ Private Key, Mnemonic Words or Keystore;
          </p>
        </li>
        <li>
          <p>
            c) freeze the wallet;
          </p>
        </li>
        <li>
          <p>
            d) report the loss of wallet;
          </p>
        </li>
        <li>
          <p>
            e) recover the wallet; or
          </p>
        </li>
        <li>
          <p>
            f) rollback transactions.
          </p>
        </li>
      </ul>
      <p>
        2. You shall bear sole responsibility to take care of your devices, back up
        the Platinum Wallet App, and back up the Mnemonic Words, Private Key and
        Keystore. In the event that: your device is lost, your Platinum Wallet App
        or your wallet is deleted and not backed up, your wallet is stolen or you
        forget your Private Key, Mnemonic Words or Keystore, the Company will not
        be able to recover the wallet or recover Private Key, Mnemonic Words or
        Keystore. The Company may not be able to cancel transactions for the
        mishandling of Users (such as typing in wrong addresses for transactions,
        wrong amounts to be exchanged) and the Company shall not be responsible in
        any way in respect of the same.
      </p>
      <p>
        3. Platinum Wallet does not support all existing tokens. Do not use
        Platinum Wallet to handle any non-supported tokens.
      </p>
      <p>
        4. The DApps integrated into Platinum Wallet include those developed
        independently by Company and those developed by third parties. Platinum
        Wallet only provides blockchain search and browser functions for those
        third-party-developed DApps, and thus Platinum Wallet does not offer any
        guarantee for functions or service qualities of those third-party-developed
        DApps. Users shall, at their sole discretion, decide whether there would be
        any risks to accept the services provided by or to conduct transactions on
        the third-party-developed DApps.
      </p>
      <p>
        5. If Users access any websites and any third-party-developed DApps not
        integrated on Platinum Wallet by entering URL under the developer mode,
        Users shall understand the security risks of the websites and the
        third-party-developed DApps linked by such URL, and assume all risks and
        consequences independently.
      </p>
      <br>
      <h2>
        IV. Your Rights and Obligations
      </h2>
      <p>
        1. Create or Import Wallet
      </p>
      <p>
        a) Create or import wallet: you are entitled to use Platinum Wallet to
        create and/or import wallet and use your wallet to transfer and receive
        Tokens on blockchain.
      </p>
      <p>
        b) Identification verification: Specific Users will be asked to complete
        identification verification before using Platinum Wallet to comply with
        related laws and regulations, according to the notification of Platinum
        Wallet. Specific Users may be asked to provide Personal Information
        including but not limited to name, identification card number, cell phone
        number, bank card information, etc., without which the Specific Users will
        not be able to use certain services and the Specific Users alone shall be
        responsible for the loss caused by their delay in completing the
        verification.
      </p>
      <p>
        c) Company may develop different versions of Platinum Wallet for different
        terminal devices. You shall download and install applicable version. If you
        download and install Platinum Wallet or other application with the same
        name as “Platinum Wallet” from any unauthorized third party, Company cannot
        guarantee the normal operation or security of such application. Any loss
        caused by using such application shall be borne solely by you.
      </p>
      <p>
        d) A previous version of Platinum Wallet may stop to operate after a new
        version is released. Company cannot guarantee the security, continuous
        operation or customer services for the previous version. Users shall
        download and use the latest version.
      </p>
      <p>
        2. Use of Platinum Wallet
      </p>
      <p>
        a) You shall bear sole responsibility to take care of your devices, Private
        Key, Mnemonic Words and Keystore. Company does not store or hold the above
        information for Users. You shall be solely responsible for any risks,
        liabilities, losses and expenses which result from frauds, you losing your
        mobile device, disclosing (whether actively or passively) or forgetting
        Private Key, Mnemonic Words or Keystore, or your wallet being attacked.
      </p>
      <p>
        b) Platinum Wallet Alerts. You understand and agree to comply with the
        Alert(s) published by the Company on Platinum Wallet. You shall be
        responsible for any risks, liabilities, losses and expenses which result
        from your failure to comply with any Alert(s).
      </p>
      <p>
        c) You understand that Platinum Wallet undertakes no responsibility to
        conduct due diligence on the services or transactions provided by
        third-party-developed DApps or Smart Contracts. You shall assess carefully
        and assume all risks in connection with the use of Platinum Wallet.
      </p>
      <p>
        d) Provision of information and documents. To the extent that the Company
        determines, in its sole discretion, that it is necessary to obtain certain
        information about User in order to comply with any applicable law or
        regulation in connection with the use or operation of Platinum Wallet, User
        shall provide Company with such information promptly upon such request, and
        acknowledges and accepts that Company may restrict, suspend or terminate
        your use of Platinum Wallet until such requested information has been
        provided to the satisfaction of Company. User undertakes to notify Company
        of any change in the documents and information provided by User to Company
        pursuant to this Agreement and in the absence of any notification in
        writing notifying of any change, Company is entitled to assume that the
        documents and information provided by User remain true, correct, not
        misleading and unchanged.
      </p>
      <p>
        e) Complete identification verification. If Company reasonably deems your
        operation or transactions to be abnormal, or considers your identification
        to be doubtful, or Company considers it necessary to verify your
        identification documents or other necessary documents, you shall cooperate
        with Company and provide your valid identification documents or other
        necessary documents and complete the identification verification in time.
      </p>
      <p>
        f) Transfer of Tokens
      </p>
      <p>
        i.You understand that you may be subject to daily limits on the amount and
        times of transfers according to your location, regulatory requirements,
        transferring purposes, risk control by Platinum Wallet, or identification
        verification.
      </p>
      <p>
        ii.You understand that blockchain operations are “irrevocable”. When you
        use Platinum Wallet to transfer Tokens, you shall be solely responsible for
        the consequences of your mishandling of the transfer (including but not
        limited to wrong address, problems of the node servers selected by you).
      </p>
      <p>
        iii.You understand that the following reasons may result in a “transfer
        failed” or “mining overtime” prompt:
      </p>
      <ul>
        <li>
          <p>
            insufficient balance in wallet;
          </p>
        </li>
        <li>
          <p>
            insufficient gas for transaction;
          </p>
        </li>
        <li>
          <p>
            blockchain’s failure to execute the code of smart contracts;
          </p>
        </li>
        <li>
          <p>
            the transfer amount exceeding the transfer limits imposed by
            authorities, Platinum Wallet or laws or regulations;
          </p>
        </li>
        <li>
          <p>
            technical failure of the network or equipment;
          </p>
        </li>
        <li>
          <p>
            abandoned transactions result from blockchain network congestion or
            failure;
          </p>
        </li>
        <li>
          <p>
            the wallet address of yours or your counterparty’s is identified as
            special addresses, such as high-risk address.
          </p>
        </li>
      </ul>
      <p>
        iv.You understand that Platinum Wallet is only a tool for transfer of
        Tokens. Company shall be deemed to have fulfilled its obligations once you
        have completed the transfer and shall not be held liable for any dispute in
        relation thereto.
      </p>
      <p>
        g) Compliance. You understand that you shall abide by applicable laws,
        regulations and policies when you use Platinum Wallet or the DApps or the
        Smart Contracts on Platinum Wallet.
      </p>
      <p>
        h) Notifications. Platinum Wallet may send notifications to you by web
        announcements, e-mails, text messages, phone calls, Notification Centre
        information, popup tips or client-end notices (e.g., information about your
        transfer or suggestions on certain operations) which you shall be aware of
        timely.
      </p>
      <p>
        i) Service fees and taxes.
      </p>
      <p>
        i.When you use third-party-developed Smart Contracts may charge handling
        fees and/or service fees from you, which shall be subject to the fees
        collected by those Smart Contracts, and the relevant information displayed
        on Platinum Wallet is merely for your reference;
      </p>
      <p>
        ii.The Company does not charge you any service fees or handling fees for
        the time being. The Company may reach an agreement with you or announce
        rules regarding service fees in the future;
      </p>
      <p>
        iii.You need to pay “gas” or network fees when you transfer Tokens, the
        amount of which would be on your sole discretion and would be collected by
        the relevant blockchain network;
      </p>
      <p>
        iv.You understand that your transfer of Tokens may fail under certain
        circumstances, including but not limited to insufficient “gas” or network
        fees paid by you for the transfer of Tokens during the time of your
        transfer, or the relevant blockchain network being unstable, and in such
        event, you may still be charged gas by the relevant blockchain network,
        notwithstanding the failed transfer attempted;
      </p>
      <p>
        v.You shall bear all the applicable taxes and other expenses occurred due
        to your transactions on Platinum Wallet.
      </p>
      <br>
      <h2>
        V. Risks
      </h2>
      <p>
        1. You understand and acknowledge that the blockchain technology is a field
        of innovation where the laws and regulations are not fully established. You
        may be faced with material risks including instability of technology or
        failure for fiat-token exchange. You also understand that Tokens have much
        higher volatility comparing to other financial assets. You shall hold or
        dispose of the Tokens in a reasonable way and corresponding to your
        financial status and risk preferences. You also acknowledge that the market
        information is captured from exchanges by Platinum Wallet and may not
        represent the latest or the best quotation of each Token.
      </p>
      <p>
        2. If you or your counterparty fails to comply with this Agreement or fails
        to follow the instructions, tips or rules on the website or on the page of
        the transaction or payment, the Company does not guarantee successful
        transfer of the Tokens and the Company shall not be held liable for any of
        the consequences of such failure. If you or your counterparty has already
        received the payment in Platinum Wallet or third-party wallet, you
        understand that transactions on blockchain are irreversible and
        irrevocable. You and your counterparty shall assume the liabilities and
        consequences of your transactions.
      </p>
      <p>
        3. You understand and acknowledge that Platinum Wallet is only an interface
        tool for Users to interact with the third-party-developed Smart Contracts
        and displays relevant results of such completed transactions.
      </p>
      <p>
        4. When you use third-party-developed DApps and Smart Contracts integrated
        in Platinum Wallet, Company strongly suggest you read the terms of use,
        privacy policy, and other relevant documents and information of such
        third-party-developed DApps and Smart Contracts carefully, get familiar
        with the counterparty and the product information and evaluate the risks
        before you make transactions on such DApps or Smart Contracts. You
        understand that such transactions and corresponding contractual
        relationship are between you and your counterparty, instead of the Company.
        The Company shall not be held liable for any risks, responsibilities,
        losses or expenses occurred due to such transactions.
      </p>
      <p>
        5. When you transfer your tokens directly to another wallet address, it is
        your sole responsibility to make sure that your counterparty is a person
        with full capacity for civil acts and decide whether you shall transact
        with him/her.
      </p>
      <p>
        6. You shall check the official blockchain system or other blockchain tools
        when you receive an Alert such as “transaction failed” or “mining overtime”
        in order to avoid repetitive transfer. If you fail to follow this
        instruction, you shall bear the losses and expenses occurred due to such
        repetitive transfer.
      </p>
      <p>
        7. You understand that after you create or import wallet on Platinum
        Wallet, your Keystore and Mnemonic Words will not be stored in Platinum
        Wallet or on the servers of Company. You may change another device to use
        Platinum Wallet after you follow the instructions on Platinum Wallet to
        back up your wallet. If you lose your device before you could write down or
        backup your Private Key, Mnemonic Words or Keystore, you may lose your
        Tokens and Company will not be able to recover them. If your Private Key,
        Mnemonic Words or Keystore is disclosed or the device which stores or holds
        your Private Key, Mnemonic Words or Keystore is hacked or attacked, you may
        lose your Tokens and Company will not be able to recover them. Any and all
        losses arising in connection with the foregoing shall be borne solely by
        you.
      </p>
      <p>
        8. We suggest you backup your Private Key, Mnemonic Words and Keystore when
        you create or import wallet by writing them down on papers or backup them
        in password management apps. Please do not use electronic methods such as
        screenshots, e-mails, note-taking apps in cell phones, text messages or
        messenger apps to backup any of the foregoing information.
      </p>
      <p>
        9. In order to avoid potential security risks, we suggest you use Platinum
        Wallet in a secured network environment. Please do not use a jailbreak or
        rooted mobile device.
      </p>
      <p>
        10. Please be alert to frauds when you use Platinum Wallet. If you find any
        suspicious activity, we encourage you to inform us immediately.
      </p>
      <br>
      <h2>
        VI. Change, Suspension, Termination of Company Service
      </h2>
      <p>
        1. You acknowledge and accept that Company may, at its sole discretion,
        provide only a part of the Services for the time being, suspend certain
        Services or provide new Services in the future. When we change our
        Services, your continuous use of Platinum Wallet is deemed as your
        acceptance of this Agreement and revisions of this Agreement.
      </p>
      <p>
        2. In order to avoid (to the extent possible) any mishandling of Platinum
        Wallet or any risk to the security of your Tokens, you shall not use
        Platinum Wallet if you do not possess the basic knowledge of blockchain.
        For Users who do not possess basic knowledge of blockchain, Company may
        refuse to provide all or part of the Services on Platinum Wallet to such
        Users.
      </p>
      <p>
        3. You understand that Company may suspend the Services under the following
        circumstances (or may completely terminate the Services in connection with
        any of the following circumstances):
      </p>
      <p>
        a) maintenance, upgrading, failure of equipment and blockchain system and
        the interruption of communications etc., which lead to the suspension of
        the operation of Platinum Wallet;
      </p>
      <p>
        b) force majeure events including but not limited to typhoon, earthquake,
        tsunami, flood, power outage, war, or terrorist attacks, or computer
        viruses, trojan horse, hacker attacks, system instability or government
        behaviors and other reasons, which result in the Company’s inability to
        provide Services or if in Company’s reasonable opinion, continuous
        provision of Services would result in significant risks;
      </p>
      <p>
        c) material adverse change of applicable laws or policies; or
      </p>
      <p>
        d) any other event(s) which Company cannot control or reasonably predict.
      </p>
      <p>
        4. Company reserves the right to unilaterally suspend or terminate all or
        part of the Services or any function of Platinum Wallet under the following
        circumstances:
      </p>
      <p>
        a) death of Users;
      </p>
      <p>
        b) if you steal others’ wallets information or mobile devices;
      </p>
      <p>
        c) if you provide false Personal Information on Platinum Wallet;
      </p>
      <p>
        d) if you refuse to allow mandatory update of Platinum Wallet;
      </p>
      <p>
        e) if you use Platinum Wallet to commit illegal or criminal activities;
      </p>
      <p>
        f) if you hinder the normal use of Platinum Wallet by other Users;
      </p>
      <p>
        g) if you pretend to be staff or management personnel of Company;
      </p>
      <p>
        h) if you threaten the normal operation of Company computer system by
        attack, invasion, alternation or any other means;
      </p>
      <p>
        i) if you use Platinum Wallet to send spam; or
      </p>
      <p>
        j) if you spread rumours which endanger the goodwill of Company and
        Platinum Wallet;
      </p>
      <p>
        k) if you conduct any illegal activities, breach this Agreement etc. or
        other circumstances under which Company reasonably considers necessary to
        suspend Services.
      </p>
      <p>
        5. You are entitled to export your wallets within a reasonable amount of
        time if Company changes, suspends or terminates its Services.
      </p>
      <br>
      <h2>
        VII. Your Representations and Warranties
      </h2>
      <p>
        1. You shall comply with all applicable laws and regulations of the country
        or area you reside in. You shall not use Platinum Wallet for any unlawful
        purposes or by any unlawful means.
      </p>
      <p>
        2. You shall not use Platinum Wallet to commit any illegal or unlawful
        activities, including but not limited to:
      </p>
      <p>
        a) activities endangering national security of the country or area you
        reside in, disclosing state secrets, overturning the government or
        undermining national unity;
      </p>
      <p>
        b) any illegal conducts, such as money laundering, illegal fund raising
        etc.;
      </p>
      <p>
        c) accessing Company services, collecting or processing the content
        provided by Company, intervening or attempting to intervene any Users, by
        the employment of any automated programs, software, network engines, web
        crawlers, web analytics tools, data mining tools or similar tools etc.;
      </p>
      <p>
        d) providing gambling information or inducing others to engage in gambling;
      </p>
      <p>
        e) invading into others’ Platinum Wallet wallets to steal Tokens;
      </p>
      <p>
        f) engaging in any inaccurate or false transactions with the counterparty;
      </p>
      <p>
        g) committing any activities which harms or attempts to harm Platinum
        Wallet service system and data;
      </p>
      <p>
        h) other activities which Company has reason to believe are inappropriate.
      </p>
      <p>
        3. You understand and accept that you shall be responsible for any
        violation of law (including but not limited to the customs and/or tax
        regulations) or for breach of this Agreement by you and shall indemnify
        Company against the losses, the third-party claims or administrative
        penalties against Company incurred by such violation or breach, including
        reasonable attorney’s fees.
      </p>
      <p>
        4. You confirm that you will pay the service fees charged by Company in
        time (if applicable). Company reserves the right to suspend the services
        when the User fails to pay service fees (if applicable).
      </p>
      <br>
      <h2>
        VIII. Privacy Policy
      </h2>
      <p>
        Any personal data or information which you provide to us is also subject to
        our privacy policy (“Platinum Wallet Privacy Policy”), which is
        incorporated by reference into this Agreement.
      </p>
      <br>
      <h2>
        IX. Disclaimer and Limitation of Liability
      </h2>
      <p>
        1. Company only undertakes obligations expressly set forth in this
        Agreement.
      </p>
      <p>
        2. YOU ACKNOWLEDGE AND ACCEPT THAT, TO THE MAXIMUM EXTENT PERMITTED BY
        APPLICABLE LAW, PLATINUM WALLET IS PROVIDED ON AN “AS IS”, “AS AVAILABLE”
        AND “WITH ALL FAULTS” BASIS. Company shall not be held liable for
        malfunction of Platinum Wallet which results from any of the following
        reasons:
      </p>
      <p>
        a) system maintenance or upgrading of Platinum Wallet;
      </p>
      <p>
        b) force majeure, such as typhoon, earthquake, flood, lightning or
        terrorist attack etc.;
      </p>
      <p>
        c) malfunction of your mobile device hardware and software, and failure of
        telecommunication lines and power supply lines;
      </p>
      <p>
        d) your improper, unauthorized or unrecognized use of the Services;
      </p>
      <p>
        e) computer viruses, trojan horse, malicious program attacks, network
        congestion, system instability, system or equipment failure,
        telecommunication failure, power failure, banking issues, government acts
        etc.;
      </p>
      <p>
        f) any other reasons not imputed to Company.
      </p>
      <p>
        3. Company shall not be held liable due to any of the following
        circumstances:
      </p>
      <p>
        a) you losing your mobile devices, deleting Platinum Wallet applications
        and wallets without back-up, forgetting Private Keys, Mnemonic Words,
        Keystores without back-up, which result in the loss of such User’s Tokens;
      </p>
      <p>
        b) you disclosing your Private Keys, Mnemonic Words, Keystores, or lending
        or transfering your Platinum Wallet wallets to others, or authorizing
        others to use your devices or Platinum Wallet wallets, or downloading
        Platinum Wallet applications through unofficial channels, or using Platinum
        Wallet applications by other insecure means, which result in the loss of
        your Tokens;
      </p>
      <p>
        c) you mishandling Platinum Wallet (including but not limited to wrong
        address, failure of the node servers selected by you) , which result in the
        loss of Tokens;
      </p>
      <p>
        d) you being unfamiliar with the lack of knowledge in relation to
        blockchain technology and your mishandling of Platinum Wallet resulting in
        loss of your Tokens;
      </p>
      <p>
        e) Platinum Wallet being unable to copy accurate transaction records due to
        system delay or blockchain instability etc.;
      </p>
      <p>
        4. Each User shall undertake the risks and consequences arising or in
        connection with the following :
      </p>
      <p>
        a) such User’s transactions on the third-party-developed DApps or Smart
        Contracts;
      </p>
      <p>
        b) the use of developer mode by Users; and
      </p>
      <p>
        5. You understand that Platinum Wallet is only a management tool for Tokens
        which is incapable to control the quality, security and legitimacy of
        products and services provided by the third-party-developed DApps or Smart
        Contracts, or the authenticity and accuracy of their information and their
        capabilities to fulfill the obligations under the agreements with you. You,
        at your sole discretion, decide whether to transact on the
        third-party-developed DApps or Smart Contracts. You understand that such
        transactions and corresponding contractual relationship are between you and
        your counterparty, instead of the Company. We kindly remind you to
        carefully review the authenticity, legitimacy, and effectiveness of related
        information provided by the third-party-developed DApps and Smart Contracts
        before you decide to use the DApps or the Smart Contracts. In addition, you
        shall also assume all the risks arising from the transactions between you
        and any third party exchanges.
      </p>
      <p>
        6.You acknowledge that Platinum Wallet may provide services to you and your
        counterparty simultaneously or may have affiliation or other interest
        relationship with foregoing parties, and you agree to waive any actual or
        potential conflicts of interests and will not claim against Company on such
        base or burden Company with more responsibilities or duty of care.
      </p>
      <p>
        7. Company does not warrant that:
      </p>
      <p>
        a) services provided by Company would satisfy all your needs;
      </p>
      <p>
        b) all techniques, products, services, information or other materials from
        Company would meet your expectations;
      </p>
      <p>
        c) all the transaction information in digital Tokens markets captured from
        the third party exchanges are prompt, accurate, complete, and reliable;
      </p>
      <p>
        d) your counterparties on Platinum Wallet will perform their obligations in
        the transaction agreements with you timely.
      </p>
      <p>
        8. In any case, the total liability for Company under this Agreement shall
        not exceed the greater of:
      </p>
      <p>
        a) the market value of 0.1 ETH; or
      </p>
      <p>
        b) 70 US Dollars.
      </p>
      <p>
        9. You are aware that Platinum Wallet is only a tool for Users to manage
        their Tokens and to display transaction information. Company does not
        provide legal, tax or investment advice. You shall seek advice from
        professional legal, tax, and investment advisors. In addition, Company
        shall not be liable for any investment loss, data loss etc. during your use
        of our service.
      </p>
      <p>
        10.You understand that we may change our entry standards, limit the range
        and ways to provide services for specific Users etc. at any time in
        accordance with applicable laws and regulations.
      </p>
      <br>
      <h2>
        X. Miscellaneous
      </h2>
      <p>
        1. No Assignment
      </p>
      <p>
        Subject to this Agreement, only you and no other person shall have the
        right to any claim against us in connection with use of the Services. You
        shall not assign, trade or transfer, or attempt to assign, trade or
        transfer, your right to any such claim. Any such assignment or transfer
        shall be void and shall not impose any obligation or liability on or
        against us to the assignee or transferee.
      </p>
      <p>
        2. Intellectual Property Rights
      </p>
      <p>
        Platinum Wallet is an application developed and owned by Company. The
        intellectual property rights of any contents displayed in Platinum Wallet
        (including this Agreement, announcements, articles, videos, audios, images,
        archives, information, materials, trademarks or logos) are owned by Company
        or the third party licensors. Users can only use the Platinum Wallet
        applications and its contents for the purpose of holding and managing their
        Tokens. In particular, without prior written consent from the Company or
        the third party licensors, no one shall use, modify, decompile, reproduce,
        publicly disseminate, alter, distribute, issue or publicly publish the
        abovementioned applications and contents. This Agreement shall not entitle
        you to any intellectual property rights, including the rights in relation
        to the use, for any purpose, of any information, image, user interface,
        logos, trademarks, trade names, internet domain names or copyright in
        connection with us or the Services.
      </p>
      <p>
        3. No Waiver
      </p>
      <p>
        Any failure by us to enforce this Agreement or to assert any right(s),
        claim(s) or causes of action against you under this Agreement shall not be
        construed as a waiver of our right to assert any right(s), claim(s) or
        causes of action against you.
      </p>
      <p>
        4. Entire Agreement
      </p>
      <p>
        This Agreement includes this Platinum Wallet Terms of Service, Platinum
        Wallet Privacy Policy, and other rules (including contents in the “Support”
        column) posted by Company from time to time.
      </p>
      <p>
        Save for Platinum Wallet Terms of Service, Platinum Wallet Privacy Policy
        which are incorporated in this Agreement, this Agreement contains the
        entire agreement and the understanding between us and supersedes all prior
        agreements, understandings or arrangements (both oral and written) in
        relation to the use of Platinum Walletand the services in connection
        thereto.
      </p>
      <p>
        5.Taxes
      </p>
      <p>
        5.1 The use of Services shall be exclusive of all taxes that are applicable
        to, arising from, or in connection to your use of the Services in any
        jurisdiction (“Payable Tax”).
      </p>
      <p>
        5.2 You shall be responsible for determining any Payable Tax and declaring,
        withholding, collecting, reporting and remitting the correct amount of
        Payable Tax to the appropriate tax authorities. You shall be solely liable
        for all penalties, claims, fines, punishments, or other liabilities arising
        from the non-fulfilment or non-performance to any extent of any of your
        obligations in relation to the Payable Tax.
      </p>
      <p>
        5.3 We shall not be responsible for determining any Payable Tax and
        declaring, withholding, collecting, reporting and remitting the correct
        amount of Payable Tax to the appropriate tax authorities.
      </p>
      <p>
        6.Governing Law and Dispute Resolution
      </p>
      <p>
        This Agreement shall be governed by and construed in accordance with the
        laws of the Republic of Singapore.
      </p>
      <p>
        In the event of any dispute arising out of or in connection with this
        Agreement, including any question regarding its existence, validity or
        termination, the Parties shall first seek settlement of that dispute. In
        the event that such dispute is not resolved within a period of 30 days from
        the commencement of such settlement process, such dispute shall be referred
        to and finally be resolved by arbitration in Singapore in accordance with
        the rules of the Singapore International Arbitration Centre (“SIAC”) for
        the time being in force, which rules are deemed to be incorporated by
        reference in this clause. The tribunal shall consist of a sole arbitrator
        to be appointed by the Chairman of the SIAC. The language of the
        arbitration shall be English. Each of the Parties irrevocably submits to
        the non-exclusive jurisdiction of the courts of Singapore to support and
        assist the arbitration process pursuant to the foregoing of this paragraph,
        including if necessary the grant of interlocutory relief pending the
        outcome of that process.
      </p>
      <p>
        7. Contracts (Rights of Third Parties) Act The Contracts (Rights of Third
        Parties) Act (Chapter 53B) of Republic of Singapore, as may be modified,
        amended or supplemented from time to time, shall apply to this. A person
        who is not a Party shall not have any rights whatsoever under this
        Agreement or to enforce this Agreement.
      </p>
      <p>
        8. Severance and Partial Invalidity
      </p>
      <p>
        8.1 If any of part of this Agreement is rendered void, illegal or
        unenforceable by any legislation to which it is subject, it shall be
        rendered void, illegal or unenforceable to that extent and no further and,
        for the avoidance of doubt, the rest of this Agreement shall continue to be
        valid and in full force and effect.
      </p>
      <p>
        8.2 The illegality, invalidity or unenforceability of any provision of this
        Agreement under the law of any jurisdiction shall not affect its legality,
        validity or enforceability under the law of any other jurisdiction nor the
        legality, validity or enforceability of any other provision.
      </p>
      <p>
        9. Translated versions of this Agreement
      </p>
      <p>
        Translated versions of this Agreement (if any) are provided for the
        convenience of Users, and are not intended to revise the English version of
        this Agreement. If there is any discrepancy between the English version and
        non-English version of this Agreement, the English version shall prevail.
      </p>
      <br>
      <h2>
        XI. Others
      </h2>
      <p>
        1. You shall fully understand and conform to the laws, regulations and
        rules in your jurisdictions which are relevant to use of the Services.
      </p>
      <p>
        2. During your use of the Services, if you come across any problems, you
        can contact us through the submission of your feedbacks on Platinum Wallet.
      </p>
      <p>
        3. This Agreement is accessible for all Users on Platinum Wallet. We
        encourage you to read this Agreement each time you log onto Platinum
        Wallet.
      </p>
      <p>
        4. This Agreement shall become effective on September 1, 2018.
      </p>
      <br>
      <p>
        As for any issues not covered in this Agreement, you shall comply with the
        announcements and relevant rules as updated by Company from time to time.
      </p>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        type="primary"
        class="dialog-button"
        @click="handleClose">
        Ok
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  created () {
    this.$eventHub.$on('popup:terms', () => { this.show = true })
  },
  methods: {
    handleClose () {
      this.show = false
    }
  }
}
</script>

<style lang="scss">
.terms {
  .el-dialog__header {
    background-color: #ffffff;
    position: fixed;
    text-align: center;
    display: block;
    width: 100%;
    padding: 50px 0 40px 0 !important;
    right: 20px;

    .el-dialog__title {
      padding: 0 20px 0 20px;
    }

    .el-dialog__headerbtn {
      top: 20px;
      right: 20px;
    }

    @media (max-width: 600px) {
      right: 0;
    }

    @media (max-width: 460px) {
      padding-bottom: 20px !important;
    }
  }

  .el-dialog__footer {
    position: fixed;
    background-color: #ffffff;
    bottom: 0;
    display: block;
    width: 100%;
    text-align: center;
    padding: 20px 0 20px 0 !important;
    right: 20px;

    .dialog-button {
      width: 300px;
    }

    @media (max-width: 600px) {
      padding: 20px 0 20px 0 !important;
      right: 0;
    }
  }

  .el-dialog__body {
    margin-top: 100px;
    margin-bottom: 100px;

    @media (max-width: 1025px) {
      padding-top: 10% !important;
    }

    @media (max-width: 321px) {
      padding-top: 0;
    }
  }

  .text {
    width: 100%;
    text-align: left;
  }

  .footer-button {
    text-align: center;
  }
}
</style>
