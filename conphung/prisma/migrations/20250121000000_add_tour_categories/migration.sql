-- Add many-to-many relation between Category and Tour
CREATE TABLE "_CategoryToTour" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_CategoryToTour_AB_unique" ON "_CategoryToTour"("A", "B");
CREATE INDEX "_CategoryToTour_B_index" ON "_CategoryToTour"("B");

ALTER TABLE "_CategoryToTour" ADD CONSTRAINT "_CategoryToTour_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoryToTour" ADD CONSTRAINT "_CategoryToTour_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
