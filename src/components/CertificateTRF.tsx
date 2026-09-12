  // High-resolution PDF Download
  const handleDownloadPdf = async () => {
    const element = certificateRef.current;

    if (!element) {
      console.error("Certificate element not found.");
      alert("The certificate could not be found. Please refresh the page and try again.");
      return;
    }

    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // Give React/browser time to finish rendering
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      // Wait for fonts to finish loading
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (fontError) {
          console.warn("Font loading wait failed:", fontError);
        }
      }

      let canvas: HTMLCanvasElement | null = null;

      /*
       * ---------------------------------------------------------
       * METHOD 1: html2canvas-pro
       * ---------------------------------------------------------
       */
      try {
        canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",

          // Capture the complete certificate instead of only
          // the currently visible portion.
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,

          // Do NOT use allowTaint here because it can prevent
          // canvas.toDataURL() from working with some images.
          allowTaint: false,
        });

        console.log("PDF rendered successfully with html2canvas-pro.");
      } catch (primaryError) {
        console.warn(
          "html2canvas-pro failed. Trying html-to-image fallback.",
          primaryError
        );
      }

      /*
       * ---------------------------------------------------------
       * METHOD 2: html-to-image fallback
       * ---------------------------------------------------------
       */
      if (!canvas) {
        try {
          const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            cacheBust: true,
            skipFonts: false,
          });

          const image = new Image();

          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () =>
              reject(
                new Error("The generated certificate image could not be loaded.")
              );

            image.src = dataUrl;
          });

          const width =
            image.naturalWidth ||
            Math.max(element.scrollWidth * 2, 1600);

          const height =
            image.naturalHeight ||
            Math.max(element.scrollHeight * 2, 2200);

          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Could not create PDF canvas context.");
          }

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, width, height);

          context.drawImage(image, 0, 0, width, height);

          console.log("PDF rendered successfully with html-to-image.");
        } catch (fallbackError) {
          console.error(
            "Both certificate rendering methods failed.",
            fallbackError
          );

          throw new Error(
            "The certificate could not be rendered for PDF generation."
          );
        }
      }

      if (!canvas) {
        throw new Error("PDF canvas was not created.");
      }

      /*
       * ---------------------------------------------------------
       * CONVERT CANVAS TO IMAGE
       * ---------------------------------------------------------
       */
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      if (!imageData || imageData === "data:,") {
        throw new Error("The certificate image could not be generated.");
      }

      /*
       * ---------------------------------------------------------
       * CREATE A4 PDF
       * ---------------------------------------------------------
       */
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;

      /*
       * Fit the complete certificate inside A4.
       */
      const scale = Math.min(
        pageWidth / imageWidth,
        pageHeight / imageHeight
      );

      const finalWidth = imageWidth * scale;
      const finalHeight = imageHeight * scale;

      // Center the certificate on the A4 page.
      const marginX = (pageWidth - finalWidth) / 2;
      const marginY = (pageHeight - finalHeight) / 2;

      pdf.addImage(
        imageData,
        "JPEG",
        marginX,
        marginY,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      /*
       * ---------------------------------------------------------
       * SAFE FILE NAME
       * ---------------------------------------------------------
       */
      const safeName =
        candidateName
          .trim()
          .replace(/[^a-zA-Z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "") || "Candidate";

      const filename =
        `Lingofi_IELTS_Test_Report_Form_${safeName}.pdf`;

      /*
       * ---------------------------------------------------------
       * RELIABLE BROWSER DOWNLOAD
       *
       * Instead of relying only on pdf.save(), create a Blob,
       * create a temporary download link, click it, then clean it.
       * ---------------------------------------------------------
       */
      const pdfBlob = pdf.output("blob");

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error("Generated PDF is empty.");
      }

      const blobUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);

      downloadLink.click();

      // Clean up the temporary link.
      document.body.removeChild(downloadLink);

      // Give the browser time to begin the download before
      // releasing the Blob URL.
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);

      /*
       * ---------------------------------------------------------
       * SUCCESS STATE
       * ---------------------------------------------------------
       */
      setDownloadSuccess(true);

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);

      console.log(`PDF downloaded successfully: ${filename}`);

    } catch (error) {
      console.error("PDF generation failed:", error);

      /*
       * Do NOT silently call window.print().
       * The user specifically clicked Download PDF, so tell them
       * what happened instead of opening the print dialog.
       */
      alert(
        "The PDF could not be generated. Please refresh the page and try again. " +
        "If the problem continues, use the Print option and select 'Save as PDF'."
      );

    } finally {
      setIsGeneratingPdf(false);
    }
  };
