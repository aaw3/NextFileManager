// oidcConfig.js
const oidcProviders = [
    {
      name: "Google",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png", // Path to the icon/image
      link: "https://accounts.google.com/o/oauth2/auth", // The OIDC authorization link
    },
    {
      name: "GitHub",
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/4a/GitHub_Mark.png",
      link: "https://github.com/login/oauth/authorize",
    },
    {
      name: "Microsoft",
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      link: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    },
  ];
  
  export default oidcProviders;
  