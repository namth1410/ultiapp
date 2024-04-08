import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Pagination } from "antd";

const ShowFile = ({ fileUri }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setPageNumber(1);
  }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages * 10);
  };

  return (
    <div>
      <Document file={fileUri} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <Pagination
        current={pageNumber}
        total={numPages}
        onChange={(page) => setPageNumber(page)}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default ShowFile;
