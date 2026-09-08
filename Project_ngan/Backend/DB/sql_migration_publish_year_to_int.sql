USE book_app;
GO

SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.books', N'U') IS NULL
        THROW 50001, 'Table dbo.books does not exist.', 1;

    IF EXISTS (
        SELECT 1
        FROM dbo.books
        WHERE publishYear IS NOT NULL
          AND TRY_CONVERT(INT, publishYear) IS NULL
    )
        THROW 50002, 'publishYear contains values that cannot be converted to INT.', 1;

    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID(N'dbo.books')
          AND name = N'CK_books_publishYearLength'
    )
    BEGIN
        ALTER TABLE dbo.books
            DROP CONSTRAINT CK_books_publishYearLength;
    END;

    IF EXISTS (
        SELECT 1
        FROM sys.columns AS c
        INNER JOIN sys.types AS t
            ON c.user_type_id = t.user_type_id
        WHERE c.object_id = OBJECT_ID(N'dbo.books')
          AND c.name = N'publishYear'
          AND t.name <> N'int'
    )
    BEGIN
        ALTER TABLE dbo.books
            ALTER COLUMN publishYear INT NULL;
    END;

    COMMIT TRANSACTION;
    PRINT 'publishYear migration completed successfully.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO
