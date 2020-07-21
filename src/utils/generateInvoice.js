const fs = require('fs');

const PDFPrinter = require('pdfmake');

function currencyFormat(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(number);
}

function createInvoice(order, path) {
  let totalInvoice = 0;
  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const options = {
    fontLayoutCache: true,
    bufferPages: true,
  };

  const printer = new PDFPrinter(fonts);
  const items = order.items.map((item) => {
    const total = item.product.price * item.quantity;
    totalInvoice += total;
    return [
      item.product.title,
      item.product.description,
      currencyFormat(item.product.price),
      item.quantity,
      currencyFormat(total),
    ];
  });
  const doc = {
    pageSize: {
      width: 612.4,
      height: 791,
    },
    pageMargins: [86, 86, 86, 86],
    defaultStyle: {
      font: 'Helvetica',
    },
    header(currentPage, pageCount, pageSize) {
      return {
        layout: 'noBorders',
        table: {
          widths: ['*', 'auto'],
          headerRows: 0,
          body: [
            [
              {
                text: 'SHOP NODE',
                alignment: 'left',
                fontSize: 30,
                marginTop: 10,
                marginLeft: 30,
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: 'right',
                marginRight: 30,
                marginTop: 10,
                fontSize: 10,
              },
            ],
          ],
        },
      };
    },
    footer: {
      text:
        'Thank you for your business! We look forward to serving you again soon!',
      alignment: 'center',
    },
    content: [
      { text: 'Invoice', fontSize: 20 },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 440,
            y2: 0,
            lineWidth: 1,
            color: 'gray',
          },
        ],
      },
      { text: `Invoice Number: ${order.id}`, marginTop: 5 },
      { text: `Invoice Date: ${new Date(order.date).toDateString()}` },
      {
        text: `Customer: ${order.user.userId.firstName} ${order.user.userId.lastName}`,
      },
      {
        text: `Total paid: ${currencyFormat(totalInvoice)}`,
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 440,
            y2: 5,
            lineWidth: 1,
            color: 'gray',
          },
        ],
      },
      {
        marginTop: 5,
        table: {
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          heights: 25,
          headerRows: 1,
          layout: 'headerLineOnly',
          dontBreakRows: true,
          body: [
            ['Item', 'Description', 'Unit Price', 'Qty', 'Total'],
            ...items,
          ],
        },
      },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(doc, options);
  pdfDoc.info.Title = `Invoice ${order.id}`;
  pdfDoc.info.Author = 'Alexander Alarcón <walarcon14@gmail.com>';
  pdfDoc.info.Keywords = 'invoice';
  pdfDoc.info.Creator = 'Alexander Alarcón <walarcon14@gmail.com>';
  pdfDoc.info.Producer = 'Alexander Alarcón <walarcon14@gmail.com>';
  pdfDoc.pipe(fs.createWriteStream(path));
  pdfDoc.end();
  return pdfDoc;
}

module.exports = createInvoice;
