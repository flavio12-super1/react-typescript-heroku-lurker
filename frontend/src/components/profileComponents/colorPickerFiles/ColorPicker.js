import React, { useEffect, useState, useRef } from "react";
import { ChromePicker } from "react-color";
import "./ColorPicker.css";

const ColorPicker = ({ tempTheme, colorKey, setTempTheme }) => {
  const [showPicker, setShowPicker] = useState(false);

  const colorPickerRef = useRef(null);

  const handleColorChange = (color) => {
    setTempTheme((prevState) => ({
      ...prevState,
      [colorKey]: color.rgb,
    }));
  };

  const handleClickOutside = (e) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleColorPickerClick = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div ref={colorPickerRef} id="colorPickerContainer">
      <div className="color-picker-input" onClick={handleColorPickerClick}>
        <span className="material-icons">format_paint</span>
        <div
          className="color-picker-selected-color"
          style={{
            backgroundColor: `rgba(${tempTheme?.[colorKey]?.r}, ${tempTheme?.[colorKey]?.g}, ${tempTheme?.[colorKey]?.b}, ${tempTheme?.[colorKey]?.a})`,
          }}
        ></div>
      </div>

      {showPicker && (
        <div className="color-picker-popup">
          <ChromePicker
            color={tempTheme?.[colorKey]}
            onChange={handleColorChange}
            disableAlpha={false}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
