import React, { useState, useEffect } from "react";
import { Grid, Astar } from "fast-astar";
import { supabase } from "../../../supabaseClient";
import { useLocation } from "react-router-dom";

export default function Pathfinder({ book }) {
    const [gridData, setGridData] = useState([]);
    const [path, setPath] = useState([]);
    const [selectedStart, setSelectedStart] = useState("1"); // Default start point
    const [selectedShelf, setSelectedShelf] = useState("A1"); // Default destination
    const [destinationDirection, setDestinationDirection] = useState("");
    const [currentLocation, setCurrentLocation] = useState("4th Floor, Highschool and Multimedia Section");
    const location = useLocation();

    const callNo = book.arcID
    const callNoPrefix = callNo.split(" ")[0].trim(); // Extract only the alphabetical prefix

    const locations = {
        "2nd Floor, Circulation Section": { w: 28, h: 19 },
        "4th Floor, Circulation Section": { w: 27, h: 11 },
        "4th Floor, Highschool and Multimedia Section": { w: 27, h: 7 },
    }

    const obstacleLoc = {
        "2nd Floor, Circulation Section": [
            { x: 23, y: 18 },
            { x: 24, y: 18 },
            { x: 25, y: 18 },
            { x: 26, y: 18 },
            { x: 27, y: 18 },
            { x: 23, y: 8 },
            { x: 23, y: 9 },
            { x: 23, y: 10 },
            { x: 23, y: 11 },
            { x: 23, y: 12 },
            { x: 23, y: 13 },
            { x: 23, y: 14 },
            { x: 23, y: 15 },
            { x: 23, y: 16 },
            { x: 23, y: 17 },
            { x: 24, y: 8 },
            { x: 25, y: 8 },
            { x: 26, y: 8 },
            { x: 27, y: 8 },
            { x: 23, y: 5 },
            { x: 6, y: 5 },
        ],
        "4th Floor, Circulation Section": [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 25, y: 0 },
            { x: 26, y: 0 },
            { x: 25, y: 1 },
            { x: 26, y: 1 },
            { x: 4, y: 3 },
            { x: 5, y: 3 },
            { x: 6, y: 3 },
            { x: 7, y: 3 },
            { x: 8, y: 3 },
            { x: 9, y: 3 },
            { x: 10, y: 3 },
            { x: 11, y: 3 },
            { x: 12, y: 3 },
            { x: 13, y: 3 },
            { x: 14, y: 3 },
            { x: 15, y: 3 },
            { x: 16, y: 3 },
            { x: 17, y: 3 },
            { x: 18, y: 3 },
            { x: 19, y: 3 },
            { x: 20, y: 3 },
            { x: 21, y: 3 },
            { x: 22, y: 3 },
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 7, y: 5 },
            { x: 7, y: 6 },
            { x: 10, y: 5 },
            { x: 10, y: 6 },
            { x: 13, y: 5 },
            { x: 13, y: 6 },
            { x: 16, y: 5 },
            { x: 16, y: 6 },
            { x: 19, y: 5 },
            { x: 19, y: 6 },
            { x: 21, y: 5 },
            { x: 21, y: 6 },
            { x: 5, y: 9 },
            { x: 5, y: 10 },
            { x: 7, y: 9 },
            { x: 7, y: 10 },
            { x: 10, y: 9 },
            { x: 10, y: 10 },
            { x: 13, y: 9 },
            { x: 13, y: 10 },
            { x: 16, y: 9 },
            { x: 16, y: 10 },
            { x: 19, y: 9 },
            { x: 19, y: 10 },
            { x: 21, y: 9 },
            { x: 21, y: 10 },
        ],
        "4th Floor, Highschool and Multimedia Section": [
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 8, y: 5 },
            { x: 8, y: 6 },
            { x: 11, y: 5 },
            { x: 11, y: 6 },
            { x: 14, y: 5 },
            { x: 14, y: 6 },
            { x: 17, y: 5 },
            { x: 17, y: 6 },
            { x: 21, y: 5 },
            { x: 21, y: 6 },
            { x: 22, y: 5 },
            { x: 22, y: 6 },
        ],
    };

    const shelves = {
        "2nd Floor, Circulation Section":
        {
            // top TS-TX, bottom TK-TR
            "A": { x_min: 1, x_max: 5, y: 1, top_range_from: "TS", top_range_to: "TX", bot_range_from: "TK", bot_range_to: "TR" },
            // top TH-TK, bottom TA-TH
            "B": { x_min: 1, x_max: 5, y: 3, top_range_from: "TH", top_range_to: "TK", bot_range_from: "TA", bot_range_to: "TH" },
            // top RT-TA, bottom RM-RT
            "C": { x_min: 1, x_max: 4, y: 5, top_range_from: "RT", top_range_to: "TA", bot_range_from: "RM", bot_range_to: "RT" },
            // top QH-RM, bottom QA-QH
            "D": { x_min: 1, x_max: 6, y: 7, top_range_from: "QH", top_range_to: "RM", bot_range_from: "QA", bot_range_to: "QH" },
            // left TX-ZA, right AG-HF
            "E": { x: 7, y_min: 1, y_max: 3, left_range_from: "TX", left_range_to: "ZA", right_range_from: "", right_range_to: "" },
            // left general refs, right coecsa doe 
            "F": { x: 9, y_min: 1, y_max: 5, left_range_from: "", left_range_to: "", right_extra: ["DOE", "DOEA"] },
            // left cfad, feasib, right clae, masters
            "G": { x: 21, y_min: 1, y_max: 4, left_extra: ["MMA", "FEASIB"], right_extra: [""] },
            // left cba cithm, right cithm cams con
            "H": { x: 23, y_min: 1, y_max: 3, left_extra: ["CBA"], right_extra: ["CITHM", "CAMS", "CON"] },
            // top coecsa dcs doa, bottom PE-QA
            "I": { x_min: 12, x_max: 17, y: 7, top_extra: ["DCS", "ARCH"], bot_range_from: "PE", bot_range_to: "QA" },
            // top LB-PE, bottom SCRA L-LB
            "J": { x_min: 12, x_max: 17, y: 9, top_range_from: "LB", top_range_to: "PE", bot_range_from: "L", bot_range_to: "LB", bot_extra: ["SCRA"] },
            // top KPM-KZA PRA SCRA, bottom KF-KPM
            "K": { x_min: 12, x_max: 17, y: 11, top_range_from: "KPM", top_range_to: "KZA", top_extra: ["PRA", "SCRA"], bot_range_from: "KF", bot_range_to: "KPM" },
            // top HG-KF, bottom HF-HG
            "L": { x_min: 12, x_max: 17, y: 13, top_range_from: "HG", top_range_to: "KF", bot_range_from: "HF", bot_range_to: "HG" },
            //  top HD-HF, bottom HB-HD
            "M": { x_min: 12, x_max: 17, y: 15, top_range_from: "HD", top_range_to: "HF", bot_range_from: "HB", bot_range_to: "HD" },
            // top DS-HB, bottom A-DS
            "N": { x_min: 12, x_max: 17, y: 17, top_range_from: "DS", top_range_to: "HB", bot_range_from: "A", bot_range_to: "DS" },
        },
        "4th Floor, Circulation Section":
        {
            // left HF-P, right A-HF
            "A": { x: 1, y_min: 3, y_max: 8, left_range_from: "HF", left_range_to: "P", right_range_from: "A", right_range_to: "HF" },
            // left R-RT, right RT-Z
            "B": { x: 25, y_min: 3, y_max: 8, left_range_from: "R", left_range_to: "RT", right_range_from: "RT", right_range_to: "Z" },
            // top PL-PQ, bottom P-PL
            "C": { x_min: 5, x_max: 6, y: 1, top_range_from: "PL", top_range_to: "PQ", bot_range_from: "P", bot_range_to: "PL" },
            // top PR-PS, bottom PQ-PR
            "D": { x_min: 8, x_max: 9, y: 1, top_range_from: "PR", top_range_to: "PS", bot_range_from: "PQ", bot_range_to: "PR" },
            // top PS, bottom PS
            "E": { x_min: 11, x_max: 12, y: 1, top_extra: "PS", bot_extra: "PS", },
            // top PS, bottom PS 
            "F": { x_min: 14, x_max: 15, y: 1, top_extra: "PS", bot_extra: "PS", },
            // top QA, bottom PZ-QA
            "G": { x_min: 17, x_max: 18, y: 1, top_extra: "QA", bot_range_from: "PZ", bot_range_to: "QA" },
            // top QD-QR, bottom QA-QD
            "H": { x_min: 20, x_max: 21, y: 1, top_range_from: "QD", top_range_to: "QR", bot_range_from: "QA", bot_range_to: "QD" },
        },
        "4th Floor, Highschool and Multimedia Section":
        {
            // bottom EN, KR, JP Books
            "A": { x_min: 5, x_max: 6, y: 1, bot_range_from: "A", bot_range_to: "HF" },
            // top 001-329, bottom Gen Refs
            "B": { x_min: 8, x_max: 9, y: 1, top_range_from: "001", top_range_to: "329", bot_range_from: "RT", bot_range_to: "Z" },
            // top 421-519, bottom 330-420
            "C": { x_min: 11, x_max: 12, y: 1, top_range_from: "421", top_range_to: "519", bot_range_from: "330", bot_range_to: "420" },
            // top 647-789, bottom 520-646
            "D": { x_min: 14, x_max: 15, y: 1, top_range_from: "647", top_range_to: "789", bot_range_from: "520", bot_range_to: "646" },
            // top 821-999, bottom 790-820
            "E": { x_min: 17, x_max: 18, y: 1, top_range_from: "821", top_range_to: "999", bot_range_from: "790", bot_range_to: "820" },
            // left KR Collection, Magazines, Research Collection
            "F": { x: 26, y_min: 2, y_max: 3, top_extra: "PS", bot_extra: "PS", },
            // left Textbooks
            "G": { x: 26, y_min: 4, y_max: 5, top_extra: "QA", bot_range_from: "PZ", bot_range_to: "QA" },
        }
    };

    const expandedShelves = {};

    Object.entries(shelves[currentLocation]).forEach(([section, details]) => {
        if (details.x_min !== undefined && details.x_max !== undefined) {
            // For sections with multiple X positions (row-based)
            for (let x = details.x_min; x <= details.x_max; x++) {
                expandedShelves[`${section}${x}`] = { x, y: details.y, ...details };
            }
        } else if (details.y_min !== undefined && details.y_max !== undefined) {
            // For sections with multiple Y positions (column-based)
            for (let y = details.y_min; y <= details.y_max; y++) {
                expandedShelves[`${section}${y}`] = { x: details.x, y, ...details };
            }
        } else {
            // Single shelf location case
            expandedShelves[section] = details;
        }
    });

    const starts = {
        "2nd Floor, Circulation Section": {
            "1": { x: 9, y: 18 },
            "2": { x: 21, y: 18 },
        },
        "4th Floor, Circulation Section": {
            "1": { x: 3, y: 10 },
            "2": { x: 23, y: 10 },
        },
        "4th Floor, Highschool and Multimedia Section": {
            "1": { x: 19, y: 6 },
            "2": { x: 4, y: 6 },
        }
    };

    function isInRange(call, from, to) {
        return from <= call && call <= to;
    }

    useEffect(() => {
        if (path.length === 0) return;

        let index = 0;
        let animatedPath = [];

        // Reset grid to remove previous paths before animation starts
        setGridData((prevGrid) =>
            prevGrid.map((row) =>
                row.map((cell) => ({
                    ...cell,
                    isPath: false, // Ensure no path is visible initially
                }))
            )
        );

        const interval = setInterval(() => {
            if (index < path.length) {
                animatedPath.push(path[index]);
                setGridData((prevGrid) =>
                    prevGrid.map((row) =>
                        row.map((cell) => ({
                            ...cell,
                            isPath: animatedPath.some(p => p.x === cell.x && p.y === cell.y),
                        }))
                    )
                );
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Adjust speed of animation (milliseconds)

        return () => clearInterval(interval);
    }, [path]); // Re-run when `path` changes

    useEffect(() => {
        console.log(book)
        setPath([]);
        setCurrentLocation("")
        if (!isNaN(callNoPrefix)) {
            // If callNoPrefix is a number  
            setCurrentLocation("4th Floor, Highschool and Multimedia Section");
        } else {
            // Extract year from pubDate (assuming it's a string in "yyyy-mm-dd" format)
            const pubYear = parseInt(book.currentPubDate.split("-")[0], 10);

            if (pubYear <= 2009) {
                setCurrentLocation("4th Floor, Circulation Section");
            } else {
                setCurrentLocation("2nd Floor, Circulation Section");
            }
        }

        console.log(callNoPrefix, currentLocation)

        const cols = locations[currentLocation]?.w;
        const rows = locations[currentLocation]?.h;
        let grid = new Grid({ col: cols, row: rows });

        console.log(cols, rows)

        let obstacles = obstacleLoc[currentLocation]?.map(({ x, y }) => [x, y]) || [];

        Object.entries(expandedShelves).forEach(([name, { x, y }]) => {
            if (name !== selectedShelf) {
                obstacles.push([x, y]);
            }
        });

        obstacles.forEach(([x, y]) => {
            grid.set([x, y], "value", 1);
        });

        let targetShelf = null;
        let targetDirection = "";
        let targetPosition = null;

        let exactMatch = null;
        let rangeMatch = null;

        // First pass: Prioritize explicit `_extra` matches
        for (let [shelf, details] of Object.entries(expandedShelves)) {
            //console.log(`Checking shelf: ${shelf}`);

            if (Array.isArray(details.top_extra) && details.top_extra.includes(callNoPrefix)) {
                console.log(callNoPrefix, "explicitly matched in", shelf, "as Top");
                exactMatch = { shelf, direction: "Top", x: Math.round((details.x_min + details.x_max) / 2), y: details.y - 1 };
                break; // Stop on first exact match
            }
            if (Array.isArray(details.bot_extra) && details.bot_extra.includes(callNoPrefix)) {
                console.log(callNoPrefix, "explicitly matched in", shelf, "as Bottom");
                exactMatch = { shelf, direction: "Bottom", x: Math.round((details.x_min + details.x_max) / 2), y: details.y + 1 };
                break;
            }
            if (Array.isArray(details.left_extra) && details.left_extra.includes(callNoPrefix)) {
                console.log(callNoPrefix, "explicitly matched in", shelf, "as Left");
                exactMatch = { shelf, direction: "Left", x: details.x - 1, y: Math.round((details.y_min + details.y_max) / 2) };
                break;
            }
            if (Array.isArray(details.right_extra) && details.right_extra.includes(callNoPrefix)) {
                console.log(callNoPrefix, "explicitly matched in", shelf, "as Right");
                exactMatch = { shelf, direction: "Right", x: details.x + 1, y: Math.round((details.y_min + details.y_max) / 2) };
                break;
            }
        }

        // Second pass: Check `isInRange` if no `_extra` match was found
        if (!exactMatch) {
            for (let [shelf, details] of Object.entries(expandedShelves)) {
                if (isInRange(callNoPrefix, details.top_range_from, details.top_range_to)) {
                    console.log(callNoPrefix, "matched by range in", shelf, "as Top");
                    rangeMatch = { shelf, direction: "Top", x: Math.round((details.x_min + details.x_max) / 2), y: details.y - 1 };
                    break;
                }
                if (isInRange(callNoPrefix, details.bot_range_from, details.bot_range_to)) {
                    console.log(callNoPrefix, "matched by range in", shelf, "as Bottom");
                    rangeMatch = { shelf, direction: "Bottom", x: Math.round((details.x_min + details.x_max) / 2), y: details.y + 1 };
                    break;
                }
                if (isInRange(callNoPrefix, details.left_range_from, details.left_range_to)) {
                    console.log(callNoPrefix, "matched by range in", shelf, "as Left");
                    rangeMatch = { shelf, direction: "Left", x: details.x - 1, y: Math.round((details.y_min + details.y_max) / 2) };
                    break;
                }
                if (isInRange(callNoPrefix, details.right_range_from, details.right_range_to)) {
                    console.log(callNoPrefix, "matched by range in", shelf, "as Right");
                    rangeMatch = { shelf, direction: "Right", x: details.x + 1, y: Math.round((details.y_min + details.y_max) / 2) };
                    break;
                }
            }
        }

        // Assign the final match, prioritizing `_extra`
        let finalMatch = exactMatch || rangeMatch;

        if (finalMatch) {
            targetShelf = finalMatch.shelf;
            targetDirection = finalMatch.direction;
            targetPosition = { x: finalMatch.x, y: finalMatch.y };
        }

        if (!targetShelf || !targetPosition) return;

        console.log("Target shelf:", targetShelf, "Target position:", targetPosition);

        setSelectedShelf(targetShelf);
        setDestinationDirection(targetDirection);

        let astar = new Astar(grid);
        let startPos = starts[currentLocation]?.[selectedStart];
        let endPos = targetPosition;

        let pathResult = astar.search(
            [startPos.x, startPos.y],
            [endPos.x, endPos.y],
            { rightAngle: true, optimalResult: true }
        );

        if (Array.isArray(pathResult)) {
            setPath(pathResult.map(coord => ({ x: coord[0], y: coord[1] })));
        }

        let newGrid = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                let isShelf = Object.keys(expandedShelves).some(
                    name => name.startsWith(selectedShelf[0]) && expandedShelves[name].x === c && expandedShelves[name].y === r
                );
                let isObstacle = !isShelf && obstacles.some(([x, y]) => x === c && y === r);
                let isPath = pathResult.some(([x, y]) => x === c && y === r);
                let startName = Object.keys(starts[currentLocation]?.[selectedStart]).find(name => starts[currentLocation]?.[selectedStart][name].x === c && starts[currentLocation]?.[selectedStart][name].y === r);

                row.push({ x: c, y: r, isObstacle, isPath, startName, isShelf });
            }
            newGrid.push(row);
        }
        setGridData(newGrid);
        console.log(book)
    }, [selectedStart, selectedShelf, location, currentLocation]);


    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Location</h2>
            </div>
            <div className="w-full text-center font-semibold text-lg">
                {currentLocation}
            </div>
            <div className="my-2 flex justify-center items-center w-full">
                <div className="w-fit" style={{ display: "grid", gridTemplateColumns: `repeat(${locations[currentLocation]?.w}, 24px)` }}>
                    {gridData.flat().map((cell, index) => (
                        <div
                            key={index}
                            style={{
                                width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center",
                                border: "1px solid black",
                                backgroundColor:
                                    cell.isObstacle
                                        ? "gray"
                                        : cell.isPath
                                            ? "green"
                                            : cell.isShelf
                                                ? "red"
                                                : "white",
                                color: cell.isPath || cell.isShelf ? "white" : "black",
                                fontSize: "10px",
                            }}
                        >
                            {cell.isObstacle ? "" : cell.isShelf ? "" : cell.isPath ? "•" : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
