const SearchEngine = {
  filter(channels, query, category, country, language) {
    return channels.filter(ch => {
      if (ch.status !== 'active') return false;

      const q = query.toLowerCase().trim();
      const matchesQuery = !q || 
        ch.name.toLowerCase().includes(q) || 
        (ch.group && ch.group.toLowerCase().includes(q)) ||
        (ch.country && ch.country.toLowerCase().includes(q)) ||
        (ch.language && ch.language.toLowerCase().includes(q));

      const matchesCat = !category || category === 'cat-all' || (ch.group && ch.group.toLowerCase() === category.toLowerCase());
      const matchesCountry = !country || ch.country === country;
      const matchesLang = !language || ch.language === language;

      return matchesQuery && matchesCat && matchesCountry && matchesLang;
    });
  }
};
