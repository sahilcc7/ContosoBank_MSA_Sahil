var builder = require('botbuilder');


exports.displayBuyStocks = function createReceiptCard(session, globalCompany, globalUsername, finalPrice) {
    var attachment = [];
    var card = new builder.ReceiptCard(session)
        .title(globalUsername)
        .facts([
            builder.Fact.create(session, '3256', 'Order Number'),
            builder.Fact.create(session, 'Bank Transfer', 'Payment Method'),
        ])
        .items([
            builder.ReceiptItem.create(session, '$' + finalPrice, 'Stock Purchase - '+ globalCompany)
            .quantity(368)
            .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
    ])
        .total('$' + finalPrice)
        .buttons([
        ]);

        attachment.push(card);
        
                    var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(attachment);
                    session.send(message);


}





