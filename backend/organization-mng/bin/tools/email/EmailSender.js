"use strict";

const nodemailer = require('nodemailer');

const { of, throwError,defer } = require("rxjs");
const { mergeMap, catchError } = require('rxjs/operators');

class EmailSender {


    /**
     * Send emails
     * @param {*} mailOptions.auth
     * @param {*} mailOptions.auth.user
     * @param {*} mailOptions.auth.refreshToken
     * @param {*} mailOptions.auth.clientId
     * @param {*} mailOptions.auth.clientSecret
     * @param {*} mailOptions.from
     * @param {*} mailOptions.to
     * @param {*} mailOptions.subject 
     * @param {*} mailOptions.attachments 
     */
  static sendEmail$(mailSettings) {
    let transport = {};
    switch(mailSettings.transportOptions.service){
      case "OUTLOOK":
        transport = {
          host: mailSettings.transportOptions.host,
          port: mailSettings.transportOptions.port,
          secureConnection: false,
          debug: true,
          // Needed on Windows because Antivirus
          tls: {
            ciphers: "SSLv3"
          },
          requireTLS:true,
          auth: {
            user: mailSettings.transportOptions.user,
            pass: mailSettings.transportOptions.pass
          }
        };
      break;
      case "SMTP":
        transport = {
          host: mailSettings.transportOptions.host,
          port: mailSettings.transportOptions.port,
          secure: mailSettings.transportOptions.secure,
          auth: {
            type: 'LOGIN',
            user: mailSettings.transportOptions.user,
            pass: mailSettings.transportOptions.pass
          }
        };
        break;
      default:
        transport = {
          service: 'Gmail',
          port: 465,
          secure: true,
          // Needed on Windows because Antivirus
          tls: {
            rejectUnauthorized: false
          },
          auth: {
            type: 'OAuth2',
            user: mailSettings.transportOptions.user,
            refreshToken: mailSettings.transportOptions.refreshToken,
            clientId: mailSettings.transportOptions.clientId,
            clientSecret: mailSettings.transportOptions.clientSecret
          }
        };
    }
      return of(nodemailer.createTransport(transport))
      .pipe(
          mergeMap(transporter => 
            defer(() => transporter.sendMail(mailSettings.mailOptions))
            .pipe(
              catchError(error => {
                (()=>{})("ERROR SENDING EMAIL");
                return throwError(error)
              })
            )
          )
      );
  }
 
}

/**
 * @returns EmailSender
 */
module.exports = EmailSender;
