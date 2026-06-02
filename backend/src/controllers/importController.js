const XLSX = require("xlsx");
const District = require("../models/District");
const Station = require("../models/Station");
const fs = require("fs");

exports.importStations = async (req, res) => {
    try {
        const workbook = XLSX.readFile(req.file.path);

        const sheet =
            workbook.Sheets[workbook.SheetNames[0]];

        const rows =
            XLSX.utils.sheet_to_json(sheet);

        let inserted = 0;
        let updated = 0;
        let unchanged = 0;
        let districtsCreated = 0;

        const messages = [];
        const errors = [];

        for (const row of rows) {
            let district = await District.findOne({
                districtName: {
                    $regex: `^${row.districtName.trim()}$`,
                    $options: "i",
                },
            });

            if (!district) {
                district = await District.create({
                    districtName: row.districtName.trim(),
                });

                districtsCreated++;

                messages.push(
                    `District Created - ${row.districtName}`
                );
            }

            const exists =
                await Station.findOne({
                    stationName: row.stationName,
                    districtId: district._id,
                });

            if (exists) {

                const isSame =
                    exists.address === row.address &&
                    exists.primaryOfficerName === row.primaryOfficerName &&
                    String(exists.primaryOfficerPhone) === String(row.primaryOfficerPhone) &&
                    exists.secondaryOfficerName === row.secondaryOfficerName &&
                    String(exists.secondaryOfficerPhone) === String(row.secondaryOfficerPhone);

                if (isSame) {
                    unchanged++;

                    messages.push(
                        `${row.stationName} - Already up to date`
                    );

                    continue;
                }

                await Station.findByIdAndUpdate(
                    exists._id,
                    {
                        address: row.address,
                        primaryOfficerName: row.primaryOfficerName,
                        primaryOfficerPhone: row.primaryOfficerPhone,
                        secondaryOfficerName: row.secondaryOfficerName,
                        secondaryOfficerPhone: row.secondaryOfficerPhone,
                    }
                );

                updated++;

                messages.push(
                    `${row.stationName} - Updated`
                );

                continue;
            }

            await Station.create({
                districtId: district._id,
                stationName: row.stationName,
                address: row.address,
                primaryOfficerName: row.primaryOfficerName,
                primaryOfficerPhone: row.primaryOfficerPhone,
                secondaryOfficerName: row.secondaryOfficerName,
                secondaryOfficerPhone: row.secondaryOfficerPhone,
            });

            inserted++;

            messages.push(
                `${row.stationName} - Inserted`
            );
        }

        // Delete uploaded excel after processing
        // if (req.file && fs.existsSync(req.file.path)) {
        //     fs.unlinkSync(req.file.path);
        // }

        res.status(200).json({
            success: true,
            inserted,
            updated,
            unchanged,
            districtsCreated,
            messages,
            errors,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};