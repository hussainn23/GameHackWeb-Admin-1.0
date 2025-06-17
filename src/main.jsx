import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from './components/ui/sidebar.jsx';
import Mainlayout from './Mainlayout.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>

          <SidebarProvider>
                      <div className="flex min-h-screen w-full">
                      <SidebarInset>
                          <main className="flex-1 flex-col">
                          <Mainlayout />
                          
                          </main>
                      </SidebarInset>
                      </div>
                  </SidebarProvider>

    </BrowserRouter>
  </React.StrictMode>
);
