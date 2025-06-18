# Project Proposal: Sewage Discharge Awareness Website

## Project Overview

**Project Name:** *Dirty Water*  
**Objective:** Build a public-facing website that empowers people to make informed decisions about when and where it’s safe to swim, surf, paddleboard, or walk near coastal or river water, based on near-time sewage discharge data.

---

![Wireframes](/assets/images/DirtyWater%20-%20wireframe.png)

---

## Target Audience

This site is for:

- Environmentally conscious individuals
- Families with children
- Surfers, swimmers, and dog walkers
- Outdoor enthusiasts
- Local community groups
- Anyone who wants to avoid unnecessary health risks from polluted water

---

## Idea

**Problem:**  
Sewage is often discharged into rivers and the sea during storms or system overloads, but this information is often hard to understand, does not give advice or allows users to easily complain to local water companies.

**Solution:**  
Create a simple, mobile-friendly website where users can check recent sewage discharge events at their local river or beach, learn about the risks, and take action if they wish.

---

##  Core Features

1. ** Interactive Map**  
   A responsive map interface centered on Cornwall (for now) showing:
   - Sewage outflow points
   - Intuitive interface to show if discharge has happened or not (event in the past 24 hours or not)

2. ** Sewage Discharge Points**  
   Each point on the map includes:
   - Location name
   - Last known discharge event (with date/time)
   - Length of discharge (time)

3. ** Health & Safety Advice**  
   - Guidance on how long to avoid water after discharge
   - Symptoms to watch for
   - Best practices for water activities

4. ** Navigation Bar**  
   Simple top navigation for:
   - Home / Map
   - About
   - FAQs
   - Contact

5. ** Hero Image**  
   A powerful landing page image with a short mission statement and call-to-action button.

6. ** FAQs Page**  
   - What is sewage discharge?
   - Is it legal?
   - How is the data collected?
   - What are the health risks?
   - Etc.

7. ** Contact Operator Section**  
   - Tools and templates to help users send a complaint to their water company (and MP)
   - Contact directory of water providers by region

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Mapping:** TBD (ArcGIS SDK or Leaflet with sewage discharge GeoJSON API)
- **Backend/API:** TBD
- **Hosting:** GitHub Pages


## v2
Warning updates users on discharge events
Warning based on tidal activity
Length of discharge (time) including avg litres 
	- traffic lights based on litres discharged
      - create a script to easily contact/complain to water company and MP


