const emailClientSMTPConfigs = {
    "gmail": {
        "IMAPServer": "imap.gmail.com",
        "SMTPHost": "smtp.gmail.com",
        "SMTPPort": "587",
    },
    "outlook": {
        "IMAPServer": "outlook.office365.com",
        "SMTPHost": "smpt.office365.com",
        "SMTPPort": "587",
    },
};

const EMAIL_RETRIEVAL_API = "https://us-central1-hey-addy-chatgpt.cloudfunctions.net/emailManipulator/email-utils";

class EmailRetriever {

    /**
     * 
     * @param {String} emailAddress - The email address of the account to initialize
     * @param {String} emailPassword - The password of the account to initialize
     * @param {String} emailClient - The email client hosting this email address. Usually "gmail" | "outlook"
     * @param {Boolean} verbose - Setting to true will print out errors
     */
    constructor(emailAddress, emailPassword, emailClient, verbose=false) {
        this.emailAddress = emailAddress;
        this.emailPassword = emailPassword;
        this.emailClient = emailClient;
        this.verbose = verbose;

        // Get the SMPT host, port and server for this client
        const clientIsSupported = emailClientSMTPConfigs[emailClient];
        if (!clientIsSupported) {
            const errorMessage = `Your specified email client ${emailClient} is not supported.
                Valid options are: ${Object.keys(emailClientSMTPConfigs)}`;
            throw new Error(errorMessage);
        }
        // Get email client SMTP configs
        const SMTPConfigs = emailClientSMTPConfigs[emailClient];
        this.IMAPServer = SMTPConfigs.IMAPServer;
        this.SMTPHost = SMTPConfigs.SMTPHost;
        this.SMTPPort = SMTPConfigs.SMTPPort;

    }

    /**
     * @desc Gets emails in a specific folder up to a certain limit
     * @param {String} folderName  - The name of the folder to scan
     * @param {String} limit - Max number of emails to retrieve
     * @param {String} IMAPSearchCommand - The IMAP search command for fetching emails. Usually "ALL" | "UNSEEN" | "SEEN"
     */
    async getEmailsInFolder(folderName, limit, IMAPSearchCommand) {
        // Prepare params
        const params = {
            emailAddress: this.emailAddress,
            emailPassword: this.emailPassword,
            emailClient: this.emailClient,
            emailSMTPHost: this.SMTPHost,
            emailSMTPPort: this.SMTPPort,
            emailIMAPServer: this.IMAPServer,
            maxEmails: limit,
            folderName: folderName,
            IMAPSearchCommand: IMAPSearchCommand
        };

        // Make query params a string
        const query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

        // Fetch emails from server using proprietary Addy AI tech
        return await fetch(`${EMAIL_RETRIEVAL_API}/read?${query}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    return data.emails;
                } else {
                    return undefined;
                }
            }).catch((error) => {
                if (this.verbose) console.error(error);
                throw new Error(error);
            });
    }
}

module.exports = EmailRetriever;