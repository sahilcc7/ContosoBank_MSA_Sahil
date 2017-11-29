var builder = require('botbuilder');


exports.displayWelcome = function createThumbnailCard(session) {

    var attachment = [];

    var card =  new builder.ThumbnailCard(session)
            .title('Welcome to the Contoso Bank Chatbot!')
            .subtitle('Ask me anything about your banking!')
            .text('Query your bank balance, find out if you can afford a takeaway, check stock, convert currency!')
            .images([
                builder.CardImage.create(session, 'https://i.imgur.com/bgGY3Hj.png')
            ])
            .buttons([
                
            ]);

            attachment.push(card);

            var message = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(attachment);
            session.send(message);
    }






