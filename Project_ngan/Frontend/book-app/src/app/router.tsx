import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LibraryPage from "../pages/LibraryPage";
import ManageBooksPage from "../pages/ManageBooksPage";
import ReaderPage from "../pages/ReaderPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <LibraryPage /> },
            { path: "manage", element: <ManageBooksPage /> },
            { path: "reader/:id", element: <ReaderPage /> },
        ],
    },
]);
