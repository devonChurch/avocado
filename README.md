# Avocado 🥑😋

A **React** Application to create _*accessible color palettes*_ that confirm to the [WCAG Guidelines](https://www.w3.org/TR/WCAG21/)

---

### ➡️ [**Try there application _here_**](https://devonchurch.github.io/avocado/) ⬅️

---

## 💡 Sharable URL's

As you create color palettes we automatically generate a corresponding URL that you can share with others.

### Below are some example color palettes to start you off.

- [<img width="300" alt="Purple palette" src="https://user-images.githubusercontent.com/15273233/70855475-2b166280-1f30-11ea-9786-b640a9fb3a8f.png">](https://devonchurch.github.io/avocado/?s%5B0%5D=%23e6d6d1&s%5B1%5D=%23b0d1dc&s%5B2%5D=%23ada0b2&s%5B3%5D=%236b5a70&s%5B4%5D=%23532e39&c%5B0%5D%5B0%5D=1&c%5B0%5D%5B1%5D=4&c%5B1%5D%5B0%5D=0&c%5B1%5D%5B1%5D=2)
- [<img width="300" alt="Bright palette" src="https://user-images.githubusercontent.com/15273233/70855476-2b166280-1f30-11ea-9e88-393d3d770cd6.png">](https://devonchurch.github.io/avocado/?s%5B0%5D=%23202e42&s%5B1%5D=%2338a8b7&s%5B2%5D=%23f4ebd7&s%5B3%5D=%23f0a06d&s%5B4%5D=%23d65c5b&c%5B0%5D%5B0%5D=1&c%5B0%5D%5B1%5D=0&c%5B1%5D%5B0%5D=0&c%5B1%5D%5B1%5D=3)
- [<img width="300" alt="Green palette" src="https://user-images.githubusercontent.com/15273233/70855477-2b166280-1f30-11ea-9cc9-9eae3b06bfd2.png">](https://devonchurch.github.io/avocado/?s%5B0%5D=%23ddf4a1&s%5B1%5D=%239fd250&s%5B2%5D=%237c8369&s%5B3%5D=%236c695d&s%5B4%5D=%2368444d&c%5B0%5D%5B0%5D=4&c%5B0%5D%5B1%5D=0&c%5B1%5D%5B0%5D=0&c%5B1%5D%5B1%5D=3)

---

## 💡 Reorder colors palette

You can drag individual color swatches to re-order their sequence.

![Reorder swatch example](https://user-images.githubusercontent.com/15273233/70855457-e5599a00-1f2f-11ea-929b-c72174a80052.gif)

Color swatches are presented flush with one another to better portray any incremental color differences.

<img width="521" alt="color increment example" src="https://user-images.githubusercontent.com/15273233/70855515-cf000e00-1f30-11ea-8e07-b1dd70868207.png">

---

## 💡 Updating a color swatch

You can update a swatch reference and have _*all*_ of its inherited references reflect the color change. This feature allows for great flexibility to try new color combinations with little effort.

![updating color swatch example](https://user-images.githubusercontent.com/15273233/70855526-15556d00-1f31-11ea-839c-3c4a284a59ca.gif)

---

## 💡 Accessibility reference

Color combinations show the accessibility of their combined contrast via the following three identifiers.

- ❌ `---` = **Poor** contrast ratio

- ✅ `AA-` = **Acceptable** contrast ratio

- ✅ `AAA` = **Excellent** contest ratio

![accessibility reference example](https://user-images.githubusercontent.com/15273233/70855555-7bda8b00-1f31-11ea-8fe4-98642491a073.gif)

---

## 💡 Reveal color combinations

Hovering over a color combination reveals its corresponding color swatches.

![reveal color combinations example](https://user-images.githubusercontent.com/15273233/70855561-a9273900-1f31-11ea-86da-f4d14b1145a7.gif)

---

## 💡 Delete color assets

Toggling on _**delete mode**_ allows you to remove color swatches and combinations from your palette.

![delete example](https://user-images.githubusercontent.com/15273233/70855571-c9ef8e80-1f31-11ea-9d6c-0864c9f4120a.gif)

We make sure to **not** allow users to delete color swatches that are currently associated with a color combination to avoid accidental removals 👏

---

## 💡 Create new color swatches

You can duplicate the last color swatch in your list by _clicking_ the _(add swatch)_ ➕ button.

Alternatively, you can duplicate _any_ existing color swatch by dropping it onto the _(add swatch)_ ➕ button.

![create color swatch example](https://user-images.githubusercontent.com/15273233/70855521-ee973680-1f30-11ea-882b-c7c8f5c1fd1c.gif)

---

## 💡 Create new color combinations

You can duplicate the last color combination in your list by _clicking_ the _(add combination)_ ➕ button.

Alternatively, you can drop a color swatch onto the _(add combination)_ ➕ button to create a new combination. The top _slot_ represents the **foreground** color with the bottom assigned to the **background**.

![create new combination example](https://user-images.githubusercontent.com/15273233/70855578-07541c00-1f32-11ea-8d2d-d20bdd92ca3e.gif)

When dropping a color swatch onto a new combination _slot_ we automatically choose the best contrasting color from your list of color swatches as a starting point 👍

---

## 💡 Updating a color combination

You can drop existing color swatches onto any existing color combination _slot_ to update its palette reference.

![update combination example](https://user-images.githubusercontent.com/15273233/70855588-323e7000-1f32-11ea-8b99-4051532538d1.gif)

---

## 💡 Dynamic UI color

UI states like `:focus` and `:hover` get unique color blends based on their base color.

If a color is very light, a border will appear around the swatch to differentiate it from the background.

Light and Dark colors also inherit inverted interaction states to create better contrast for our users.

![dynamic ui example](https://user-images.githubusercontent.com/15273233/70855594-51d59880-1f32-11ea-87b0-010308e96b9b.gif)
