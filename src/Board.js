import { AppData } from "./globals";
import { useEffect, useState } from "react";
import Square from './Square.js';

export default function Board({ reset, loading, selected }) {
    function squareEvent(element) {
        if (AppData.data.lastMapKey == null) {
            if (element.id != AppData.data.maze.maxPath.source) return;
            AppData.data.lastMapKey = element.id;
            AppData.data.lastElement = element;
            AppData.data.path.set(AppData.data.lastMapKey, AppData.data.lastElement);
            return;
        }
        const mapKey = element.id;

        if (mapKey == AppData.data.lastMapKey) return;

        if (AppData.data.winState) return;

        if (!AppData.data.maze.graphGroups[0].has(mapKey)) {
            return;
        }

        if (AppData.data.lastMapKey != null) {
            const node = AppData.data.maze.graph[AppData.data.lastMapKey];
            if (!node.has(mapKey)) {
                return;
            }
        }

        AppData.data.lastElement.className = "square";

        element.style.backgroundColor = AppData.constants.pathColor;
        element.className = `square ${AppData.constants.blinkClass}`;
        AppData.data.path.set(mapKey, element);

        if (mapKey == AppData.data.maze.maxPath.dest) {
            AppData.data.winState = true;
            console.log("Win!");
            for (let [key, value] of AppData.data.path) {
                value.style.backgroundColor = AppData.constants.winColor;
                value.className = `square ${AppData.constants.blinkClass}`;
            }
        }

        AppData.data.lastMapKey = element.id;
        AppData.data.lastElement = element;
    }

    function onTouchMove(event) {
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;
        const element = document.elementFromPoint(x, y);
        if (element == null) return;
        if (element.className.slice(0, 6) != 'square') return;
        squareEvent(element);
    }

    function onMouseMove(event) {
        if (event.target.className.slice(0, 6) != 'square') return;
        squareEvent(event.target);
    }

    function blink(mapKey) {
        if (AppData.data.maze.maxPath.source == mapKey && !AppData.data.winState) {
            return AppData.constants.blinkClass;
        }
        return "";

    }

    function color(mapKey) {
        if (AppData.data.maze.maxPath.dest == mapKey && !AppData.data.winState) {
            return AppData.constants.pathColor;
        }

        if (AppData.data.maze.maxPath.source == mapKey && !AppData.data.winState) {
            return AppData.constants.pathColor;
        }

        return "#fff";
    }

    if (AppData.data.maze != null) {
        // console.log("render Board");
        return (
            <>
                <div
                    onTouchMove={onTouchMove}
                    onMouseMove={onMouseMove}
                >
                    {AppData.data.maze.board.map((row, i) => (
                        <div key={i + " board-row"} className="board-row">
                            {row.map((borders, j) =>
                                <Square
                                    key={borders.key}
                                    borders={borders}
                                    mapKey={`${i} ${j}`}
                                    blink={blink(borders.key)}
                                    color={color(borders.key)}
                                />
                            )
                            }
                        </div>
                    ))}
                </div>

            </>
        );
    }
    return (<></>);
}

