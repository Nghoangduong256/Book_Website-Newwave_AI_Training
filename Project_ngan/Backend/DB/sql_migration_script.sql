USE book_app;
GO

BEGIN TRANSACTION;

BEGIN TRY
    /* =========================================================
       1. Chuyển các cột text sang NVARCHAR để lưu tiếng Việt
       ========================================================= */

    ALTER TABLE dbo.books
        ALTER COLUMN title NVARCHAR(255) NOT NULL;

    ALTER TABLE dbo.books
        ALTER COLUMN author NVARCHAR(255) NOT NULL;

    ALTER TABLE dbo.books
        ALTER COLUMN publishYear NVARCHAR(10) NULL;

    ALTER TABLE dbo.books
        ALTER COLUMN tags NVARCHAR(500) NULL;


    /* =========================================================
       2. Thêm các cột còn thiếu
       ========================================================= */

    IF COL_LENGTH('dbo.books', 'summary') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD summary NVARCHAR(MAX) NULL;
    END;

    IF COL_LENGTH('dbo.books', 'sourceType') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD sourceType VARCHAR(20) NULL;
    END;

    IF COL_LENGTH('dbo.books', 'pdfUrl') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD pdfUrl NVARCHAR(2048) NULL;
    END;

    IF COL_LENGTH('dbo.books', 'filePath') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD filePath NVARCHAR(1000) NULL;
    END;

    IF COL_LENGTH('dbo.books', 'originalFileName') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD originalFileName NVARCHAR(255) NULL;
    END;

    IF COL_LENGTH('dbo.books', 'fileSize') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD fileSize BIGINT NULL;
    END;

    IF COL_LENGTH('dbo.books', 'lastReadPage') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD lastReadPage INT NOT NULL
                CONSTRAINT DF_books_lastReadPage DEFAULT 0;
    END;

    IF COL_LENGTH('dbo.books', 'totalPages') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD totalPages INT NULL;
    END;

    IF COL_LENGTH('dbo.books', 'favorite') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD favorite BIT NOT NULL
                CONSTRAINT DF_books_favorite DEFAULT 0;
    END;

    IF COL_LENGTH('dbo.books', 'readingStatus') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD readingStatus VARCHAR(20) NOT NULL
                CONSTRAINT DF_books_readingStatus DEFAULT 'UNREAD';
    END;

    IF COL_LENGTH('dbo.books', 'createdAt') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD createdAt DATETIME2(0) NOT NULL
                CONSTRAINT DF_books_createdAt DEFAULT SYSDATETIME();
    END;

    IF COL_LENGTH('dbo.books', 'updatedAt') IS NULL
    BEGIN
        ALTER TABLE dbo.books
            ADD updatedAt DATETIME2(0) NOT NULL
                CONSTRAINT DF_books_updatedAt DEFAULT SYSDATETIME();
    END;


    /* =========================================================
       3. Cập nhật sourceType cho dữ liệu cũ
       ========================================================= */

    UPDATE dbo.books
    SET sourceType =
        CASE
            WHEN pdfUrl IS NOT NULL AND LTRIM(RTRIM(pdfUrl)) <> ''
                THEN 'REMOTE_URL'
            ELSE 'LOCAL_UPLOAD'
        END
    WHERE sourceType IS NULL;

    ALTER TABLE dbo.books
        ALTER COLUMN sourceType VARCHAR(20) NOT NULL;


    /* =========================================================
       4. Thêm các CHECK constraint
       ========================================================= */

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_sourceType
        CHECK (sourceType IN ('LOCAL_UPLOAD', 'REMOTE_URL'));

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_readingStatus
        CHECK (readingStatus IN (
            'UNREAD',
            'READING',
            'COMPLETED'
        ));

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_lastReadPage
        CHECK (lastReadPage >= 0);

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_totalPages
        CHECK (totalPages IS NULL OR totalPages >= 0);

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_fileSize
        CHECK (fileSize IS NULL OR fileSize >= 0);

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_readingProgress
        CHECK (
            totalPages IS NULL
            OR lastReadPage <= totalPages
        );

    ALTER TABLE dbo.books
        ADD CONSTRAINT CK_books_publishYearLength
        CHECK (
            publishYear IS NULL
            OR LEN(LTRIM(RTRIM(publishYear))) <= 10
        );


    /* =========================================================
       5. Tạo index phục vụ tìm kiếm và lọc
       ========================================================= */

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'IX_books_title'
          AND object_id = OBJECT_ID('dbo.books')
    )
    BEGIN
        CREATE INDEX IX_books_title
            ON dbo.books(title);
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'IX_books_author'
          AND object_id = OBJECT_ID('dbo.books')
    )
    BEGIN
        CREATE INDEX IX_books_author
            ON dbo.books(author);
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'IX_books_readingStatus'
          AND object_id = OBJECT_ID('dbo.books')
    )
    BEGIN
        CREATE INDEX IX_books_readingStatus
            ON dbo.books(readingStatus);
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'IX_books_favorite'
          AND object_id = OBJECT_ID('dbo.books')
    )
    BEGIN
        CREATE INDEX IX_books_favorite
            ON dbo.books(favorite);
    END;

    COMMIT TRANSACTION;

    PRINT 'Migration completed successfully.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'Migration failed.';
    THROW;
END CATCH;
GO