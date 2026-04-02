
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RazorpayPayment from "../../screens/payment/RazorpayPayment";

const PaymentPage = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));
	if (!user) {
		return <Navigate to="/login" replace />;
	}
	const handleSuccess = () => {
		alert("Payment successful! Subscription activated.");
		navigate("/create");
	};
	return (
		<div style={{ padding: 40 }}>
			<h2>Subscribe for ₹1/month to access Create Test</h2>
			<RazorpayPayment
				userId={user.id}
				onSuccess={handleSuccess}
			/>
		</div>
	);
};

export default PaymentPage;
