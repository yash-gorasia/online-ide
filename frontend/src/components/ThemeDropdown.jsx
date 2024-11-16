import React from 'react'
import Select from 'react-select'
import monacoThemes from 'monaco-themes/themes/themelist'
import { customStyles } from '../constants/customStyles.js'


const ThemeDropdown = ({ handleThemeChange, theme }) => {
    return (
        <div>
            <Select
                placeholder={`Select Theme`}
                options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
                    label: themeName,
                    value: themeId,
                    key: themeId
                }))}
                value={theme}
                styles={customStyles}
                onChange={(selectedOption) => handleThemeChange(selectedOption)}
            />
        </div>
    )
}

export default ThemeDropdown
