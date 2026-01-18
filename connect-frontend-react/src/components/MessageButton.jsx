import React, { useEffect, useState } from "react";
import axios from "../assets/js/api";


export default function MessageButton({ count = 4 }) {
    
  const [open, setOpen] = useState(false);
  const [unreadCount,setUnreadCount]=useState(0);

  useEffect(()=>{

    const fetch_unread_message = async ()=>{
       try {

        const res = await axios.get('/messages/unread-count');
        console.log("MSG NOTE 1");
        console.log(res.data);
        setUnreadCount(res.data);
          console.log("MSG NOTE 2");

        
       } catch (error) {
           console.log(error);
       }
    }

    fetch_unread_message();

  },[]);



  const messages = [
    "New customer message",
    "Order related query",
    "Product availability question",
    "Return request message"
  ];

  return (
    <>
      {/* Styles */}
      <style>
        {`
          .message-wrapper {
            position: relative;
          }

          .message-icon {
            font-size: 24px;
            background: #f3f4f6;
            border-radius: 50%;
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: 0.2s ease;
          }

          .message-icon:hover {
            background: #e5e7eb;
            transform: scale(1.05);
          }

          .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: red;
            color: white;
            font-size: 11px;
            font-weight: bold;
            border-radius: 50%;
            padding: 2px 6px;
            min-width: 18px;
            text-align: center;
          }

          /* Notification Box */

          .notification-box {
            position: absolute;
            top: 55px;
            right: 0;
            width: 300px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            overflow: hidden;
            animation: slideDown 0.2s ease;
            z-index: 1000;
          }

          .notification-header {
            padding: 12px;
            font-weight: bold;
            border-bottom: 1px solid #e5e7eb;
            background: #f9fafb;
          }

          .notification-item {
            padding: 10px 12px;
            border-bottom: 1px solid #f1f1f1;
            font-size: 14px;
            cursor: pointer;
          }

          .notification-item:hover {
            background: #f3f4f6;
          }

          .empty {
            padding: 15px;
            text-align: center;
            color: gray;
            font-size: 14px;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* UI */}
      <div className="message-wrapper">
        <div
          className="message-icon"
          onClick={() => setOpen(!open)}
        >
          💬
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>

        {open && (
          <div className="notification-box">
            <div className="notification-header">
              Messages
            </div>

            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="notification-item">
                  {msg}
                </div>
              ))
            ) : (
              <div className="empty">No new messages</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
