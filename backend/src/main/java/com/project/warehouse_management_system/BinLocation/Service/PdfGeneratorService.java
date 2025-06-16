package com.project.warehouse_management_system.BinLocation.Service;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.properties.TextAlignment;
import com.project.warehouse_management_system.BinLocation.Model.BinLocation;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.util.List;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
@Service
public class PdfGeneratorService {
    public BufferedImage generateQRCode(String text) {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        try {
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 150, 150);
            return MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (WriterException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void generateBinLocationsPdf(String outputPath, List<BinLocation> binLocations) throws IOException {
        float containerWidth = 400;
        float containerHeight = 200;
        PageSize pageSize = new PageSize(containerWidth, containerHeight);
        PdfWriter writer = new PdfWriter(outputPath);
        PdfDocument pdf = new PdfDocument(writer);
        pdf.setDefaultPageSize(pageSize);
        Document document = new Document(pdf);

        for (BinLocation binLocation : binLocations) {
            // Extract level and determine color
            String binCode = binLocation.getCode();
            // Add colored section
            document.add(createBinCodeWithQRCode(binCode).setPadding(20).setFixedPosition(25,40,5));
            document.add(new AreaBreak());
        }

        document.close();
    }

    private int extractLevelFromCode(String code) {
        String[] parts = code.split("-");
        return Integer.parseInt(parts[3]); // Assumes level is the 4th part
    }

    private Color getBackgroundColor(int level) {
        return switch (level) {
            case 1 -> new DeviceRgb(255, 255, 0); // Yellow
            case 2 -> new DeviceRgb(128, 0, 128); // Purple
            case 3 -> new DeviceRgb(0, 0, 255); // Blue
            case 4 -> new DeviceRgb(0, 255, 0); //green
            case 5 -> new DeviceRgb(255, 0, 0); //red
            default -> new DeviceRgb(0, 0, 0); // green
        };
    }

    private Div createBinCodeWithQRCode(String binCode) throws IOException {
        // Generate QR code image
        int level = extractLevelFromCode(binCode);
        Color backgroundColor = getBackgroundColor(level);
        BufferedImage qrCodeImage = generateQRCode(binCode);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrCodeImage, "png", baos);
        Image qrImage = new Image(ImageDataFactory.create(baos.toByteArray()))
                .setWidth(100)
                .setHeight(100);

        // Bin code text
        Paragraph binCodeHeader = new Paragraph("AREA"+"     "+"ROW"+"        "+"BAY"+"      "+"LEVEL"+"   "+"POS")
                .setBold()
                .setWidth(182)
                .setBackgroundColor(ColorConstants.WHITE)
                .setFontSize(9)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setPaddingLeft(18);
        // Bin code text
        Paragraph binCodeText = new Paragraph(binCode)
                .setBold()
                .setWidth(200)
                .setBackgroundColor(ColorConstants.WHITE)
                .setFontSize(30);
        // Create a table with two columns
        Table table = new Table(2); // 2 columns
        table.setWidth(300);
        table.addCell(new Cell().add(binCodeHeader).setBorder(Border.NO_BORDER));
        table.startNewRow();
        table.addCell(new Cell().add(binCodeText).setBorder(Border.NO_BORDER)).setTextAlignment(TextAlignment.CENTER); // Add text
        table.addCell(new Cell().add(qrImage).setBorder(Border.NO_BORDER));// Add QR code

        // Combine into a single Div
        Div container = new Div();
        container.setBackgroundColor(backgroundColor);
        container.add(table);
        return container;
    }
}



