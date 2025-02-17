import { AppData } from "./globals";
import { useState } from 'react';
import { useEffect } from "react";

export default function Square({ borders, mapKey }) {
    const [color, setColor] = useState(null);
    const [blink, setBlink] = useState("");

    useEffect(() => {
        setColor("#fff");

        if (AppData.data.maze.maxPath.source == mapKey && !AppData.data.winState) {
            setColor(AppData.constants.pathColor);
            setBlink(AppData.constants.blinkClass);
        }

        if (AppData.data.maze.maxPath.dest == mapKey && !AppData.data.winState) {
            setColor(AppData.constants.pathColor);
        }
    }, []);
    return (
        <>
            <div
                id={`${mapKey}`}
                className={`square ${blink}`}
                style={{
                    borderTop: `${borders.up}px solid #999`,
                    borderBottom: `${borders.down}px solid #999`,
                    borderLeft: `${borders.left}px solid #999`,
                    borderRight: `${borders.right}px solid #999`,
                    fontSize: 8,
                    backgroundColor: color,
                    touchAction: 'none',

                }}
            >
            </div>
        </>
    );
}
