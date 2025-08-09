import React, { useState, useEffect, useRef } from "react";
import { BotMessageSquare } from "lucide-react";

const predefinedQuestions = [
  "Hello",
  "What are my upcoming exams?",
  "How can I pay my fees?",
  "Show my attendance details",
  "What are my subjects this semester?",
  "How do I contact faculty?",
];

const mockResponses = {
  "Hello": "Hi! I’m your AI Assistant. How can I help you today?",
  "What are my upcoming exams?":
    "📅 You have Mid-Sem exams starting from 12th September.",
  "How can I pay my fees?":
    "💳 Visit the Finance section to pay via UPI, Net Banking, or Card.",
  "Show my attendance details":
    "📊 You have 88% attendance. Warning: DBMS is at 72%.",
  "What are my subjects this semester?": "📚 DBMS, CN, SE, Java, DAA.",
  "How do I contact faculty?":
    "📧 Visit Faculty section and use the email link under each name.",
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m your AI Assistant. How can I help you today?",
    },
  ]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendBotResponse = (text) => {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text },
      { sender: "bot", type: "options" },
    ]);
  };

  const handleQuestionClick = (question) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    const response =
      mockResponses[question] || "🤖 I'm still learning. Please rephrase!";
    appendBotResponse(response);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    const response =
      mockResponses[userInput] ||
      "🤖 Sorry, I don't have an answer to that yet.";
    appendBotResponse(response);
    setInput("");
  };

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      <button
        className="btn btn-primary rounded-circle"
        style={{ width: "60px", height: "60px" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <BotMessageSquare />
      </button>

      {isOpen && (
        <div
          className="card shadow"
          style={{ width: "350px", height: "450px" }}
        >
          <div className="card-header bg-primary text-white">AI Assistant</div>

          <div
            className="card-body overflow-auto"
            style={{ height: "330px", backgroundColor: "var(--bs-body-bg)" }}
          >
            {messages.map((msg, i) => {
              if (msg.type === "options") {
                return (
                  <div key={i} className="d-flex flex-wrap gap-2 my-2">
                    {predefinedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`d-flex ${
                    msg.sender === "user"
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`mb-2 p-2 rounded ${
                      msg.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-light text-dark"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <div className="card-footer p-2">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask something..."
              />
              <button className="btn btn-success" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
