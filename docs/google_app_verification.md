# App Verification

https://support.google.com/cloud/answer/9110914

If your app requests scopes categorized as sensitive or restricted, you will probably need to complete the verification process (see, however, the exceptions). Depending on the degree of access you need — read-only, read and write, and so on.

Restricted scopes are fewer in number, currently including only scopes used by the Gmail APIs, Drive APIs, and Google Fit APIs.
 
https://developers.google.com/identity/protocols/oauth2/scopes#drive
- https://www.googleapis.com/auth/drive
- https://www.googleapis.com/auth/drive.readonly
- https://www.googleapis.com/auth/drive.activity
- https://www.googleapis.com/auth/drive.activity.readonly
- https://www.googleapis.com/auth/drive.metadata
- https://www.googleapis.com/auth/drive.metadata.readonly
- https://www.googleapis.com/auth/drive.scripts

If your app requests any of the following scopes, and doesn't meet any of the criteria for an exception (see below), you will need to satisfy both the API Services User Data Policy, the Additional Requirements for Specific Scopes, which may require a more extensive review process.

Unverified Apps
https://support.google.com/cloud/answer/7454865?hl=en

Verification for apps
1. Before you start the verification process, review the OAuth Application Verification FAQ. This will help your verification process go quickly. To start the verification process for apps, do the following steps:

2. Update the OAuth consent screen details in the Google Cloud Platform Console APIs & Services Credentials:
You must have a privacy policy URL.
Add URLs for your homepage and Terms of Service if you have them.

3. Verify your website ownership through Search Console 

4. To start the verification process, submit a verification request by using the following process.

a. On the GCP Console OAuth consent screen, click Submit or Save. 
i. https://console.cloud.google.com/apis/credentials/consent?sjid=413868014423275458-NA

b. If a verification required dialog displays:
i. Add information in the text boxes for Google to verify your OAuth consent screen.
ii. When you're finished entering details, click Submit.

Note: If you add any new redirect URLs or JavaScript origins, or if you change your product name after verification, you have to go through verification again.


https://developers.google.com/terms/api-services-user-data-policy

https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes

https://developers.google.com/terms/

https://developers.google.com/identity/branding-guidelines - if using scopes