import {withMethod} from '../../lib/withMethod';
import sql from '../../lib/supabase';

export default withMethod('GET', async (req, res) => {
    const {type, searchQuery, genre} = req.query;
    let results = [];
    if (type === 'recommendations') {
        let {ageRange, ratingRange} = req.query;
        ageRange = ageRange?.split(',').map(Number);
        ratingRange = ratingRange?.split(',').map(Number);
        if (!searchQuery && !ageRange && !genre && !ratingRange) {
            return res.status(400).json({error: 'Missing search parameters'});
        }
        results = await sql`
            SELECT * FROM books
            WHERE title ILIKE ${`%${searchQuery}%`}
            ${genre ? sql`AND genre = ${genre}` : sql``}
            ${ageRange ? sql`AND age BETWEEN ${ageRange[0]} AND ${ageRange[1]}` : sql``}
            ${ratingRange ? sql`AND rating BETWEEN ${ratingRange[0]} AND ${ratingRange[1]}` : sql``}            
       `;
    } else if (type === 'reviews') {
    }
    return res.status(200).json(results);
});
