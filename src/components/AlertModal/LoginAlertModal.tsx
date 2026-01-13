import React, { type FC } from "react";
import "./LoginAlertModal.css";

interface LoginAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;

  /** ✅ 추가: 페이지별 문구 커스텀 */
  title?: string;
  message?: string;
}

const LoginAlertModal: FC<LoginAlertModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  title = "로그인 필요",
  message = "로그인이 필요한 서비스입니다.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="alert-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="alert-body">
          <p className="alert-text">{message}</p>
        </div>

        <div className="alert-modal-buttons">
          <button className="alert-btn-cancel" onClick={onClose}>
            확인
          </button>
          <button className="alert-btn-primary" onClick={onLogin}>
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAlertModal;