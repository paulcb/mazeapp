import { AppData } from "./globals";
import { useState } from 'react';
import { useEffect } from "react";

export default function Square({ borders, mapKey, blink, color }) {
    useEffect(() => {

    }, []);
    // console.log("Square render", mapKey, color, blink);
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
