USE book_app;
GO

ALTER TABLE books
ADD lastReadAt DATETIME2 NULL;