const express = require("express");

const router = express.Router();

const Customer =
    require("../models/Customer");

// Telegram helpers (send after save)
const { sendTelegramMessage, formatTelegramMessage } = require("../services/telegram");

/* TEST ROUTE */

router.get("/", async (req, res) => {

    try {

        const customers =
            await Customer.find();

        res.json(customers);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

/* REGISTER CUSTOMER */

router.post("/register", async (req, res) => {

    try {

    console.debug("[customer/register] Incoming body:", req.body);

        const customer =
            await Customer.create(req.body);

        // Send Telegram notification in the background so the API responds fast
        try {
            const savedObj = (customer && typeof customer.toObject === 'function') ? customer.toObject() : (customer || {});
            const payload = { ...savedObj, ...req.body };
            const text = formatTelegramMessage({ ...payload, source: "New Customer Registration" });

            sendTelegramMessage(text).catch((tgErr) => {
                console.error("Telegram notification failed for customer register:", tgErr.message || tgErr);
            });
        } catch (tgErr) {
            console.error("Failed to start background Telegram notification:", tgErr.message || tgErr);
        }

        res.status(201).json(customer);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

/* UPDATE STATUS */
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: "Status is required" });

        const customer = await Customer.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!customer) return res.status(404).json({ message: "Customer not found" });

        res.json(customer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

/* DELETE CUSTOMER */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) return res.status(404).json({ message: "Customer not found" });

        res.json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;